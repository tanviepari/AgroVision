import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { publicUser } from '../utils/serialize.js';
import { validate } from '../middleware/validate.js';
import { sendPasswordResetEmail, mailConfigured } from '../services/mail.js';

const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu'];

function normaliseMobile(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export const registerRules = [
  body('name').trim().notEmpty().withMessage('Please enter your full name.'),
  body('mobile').custom((value) => {
    const mobile = normaliseMobile(value);
    if (!/^[6-9]\d{9}$/.test(mobile)) throw new Error('Please enter a valid 10-digit mobile number.');
    return true;
  }),
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('Please enter a valid email address.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Password and confirm password do not match.');
    return true;
  }),
  body('location').trim().notEmpty().withMessage('Please enter your location.'),
  body('state').trim().notEmpty().withMessage('Please choose your state.'),
  body('district').trim().notEmpty().withMessage('Please enter your district.'),
  body('termsAccepted').custom((value) => {
    if (value !== true) throw new Error('Please accept the terms and conditions.');
    return true;
  }),
  validate,
];

export const loginRules = [
  body('contact').trim().notEmpty().withMessage('Please enter your mobile number or email.'),
  body('password').notEmpty().withMessage('Please enter your password.'),
  validate,
];

export const register = asyncHandler(async (req, res) => {
  const mobile = normaliseMobile(req.body.mobile);
  const email = String(req.body.email || '').trim().toLowerCase();
  const existing = await User.findOne({
    $or: [{ mobile }, ...(email ? [{ email }] : [])],
  });
  if (existing) throw new ApiError(409, 'An account with this mobile number or email already exists.');

  const password = await bcrypt.hash(req.body.password, 12);
  const user = await User.create({
    name: req.body.name.trim(),
    mobile,
    email,
    password,
    location: req.body.location.trim(),
    state: req.body.state.trim(),
    district: req.body.district.trim(),
    preferredLanguage: 'English',
    termsAcceptedAt: new Date(),
  });

  res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const contact = String(req.body.contact || '').trim();
  const mobile = normaliseMobile(contact);
  const query = contact.includes('@')
    ? { email: contact.toLowerCase() }
    : { mobile };
  const user = await User.findOne(query).select('+password');
  if (!user) throw new ApiError(401, 'Mobile, email, or password is not correct.');
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) throw new ApiError(401, 'Mobile, email, or password is not correct.');
  res.json({ token: signToken(user._id), user: publicUser(user) });
});

export const logout = asyncHandler(async (req, res) => {
  res.json({ message: 'You have been logged out.' });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, mobile, email, location, state, district, preferredLanguage, notificationPrefs } = req.body;
  if (name !== undefined) req.user.name = String(name).trim();
  if (location !== undefined) req.user.location = String(location).trim();
  if (state !== undefined) req.user.state = String(state).trim();
  if (district !== undefined) req.user.district = String(district).trim();
  if (preferredLanguage !== undefined) {
    if (!LANGUAGES.includes(preferredLanguage)) throw new ApiError(400, 'Please choose a supported language.');
    req.user.preferredLanguage = preferredLanguage;
  }
  if (mobile !== undefined) {
    const next = normaliseMobile(mobile);
    if (!/^[6-9]\d{9}$/.test(next)) throw new ApiError(400, 'Please enter a valid 10-digit mobile number.');
    const taken = await User.findOne({ mobile: next, _id: { $ne: req.user._id } });
    if (taken) throw new ApiError(409, 'This mobile number is already in use.');
    req.user.mobile = next;
  }
  if (email !== undefined) {
    const next = String(email || '').trim().toLowerCase();
    if (next && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next)) {
      throw new ApiError(400, 'Please enter a valid email address.');
    }
    if (next) {
      const taken = await User.findOne({ email: next, _id: { $ne: req.user._id } });
      if (taken) throw new ApiError(409, 'This email address is already in use.');
    }
    req.user.email = next;
  }
  if (notificationPrefs && typeof notificationPrefs === 'object') {
    req.user.notificationPrefs = {
      irrigation: Boolean(notificationPrefs.irrigation),
      disease: Boolean(notificationPrefs.disease),
      yield: Boolean(notificationPrefs.yield),
    };
  }
  await req.user.save();
  res.json({ user: publicUser(req.user) });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const contact = String(req.body.contact || '').trim();
  const generic = {
    message: 'If an account with that email exists, a reset link will be sent.',
  };
  if (!mailConfigured()) {
    res.status(503).json({
      message: 'Password reset email is not available right now. Please try again later.',
      code: 'EMAIL_NOT_CONFIGURED',
    });
    return;
  }
  if (!contact.includes('@')) {
    res.json({
      message: 'Password reset needs the email saved on your account. Add an email in Profile, or ask for help if you cannot log in.',
    });
    return;
  }

  const user = await User.findOne({ email: contact.toLowerCase() }).select('+resetPasswordTokenHash +resetPasswordExpires');
  if (!user) {
    res.json(generic);
    return;
  }

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordTokenHash = crypto.createHash('sha256').update(token).digest('hex');
  user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
  await user.save();

  const origin = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',')[0].trim();
  const resetUrl = `${origin}/reset-password?token=${token}`;
  const result = await sendPasswordResetEmail({ to: user.email, resetUrl });
  if (!result.sent) {
    res.status(503).json({ message: result.reason, code: 'EMAIL_NOT_CONFIGURED' });
    return;
  }
  res.json(generic);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const token = String(req.body.token || '');
  const password = String(req.body.password || '');
  const confirmPassword = String(req.body.confirmPassword || '');
  if (!token) throw new ApiError(400, 'This reset link is not valid.');
  if (password.length < 8) throw new ApiError(400, 'Password must be at least 8 characters.');
  if (password !== confirmPassword) throw new ApiError(400, 'Password and confirm password do not match.');

  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordTokenHash: hash,
    resetPasswordExpires: { $gt: new Date() },
  }).select('+password +resetPasswordTokenHash +resetPasswordExpires');
  if (!user) throw new ApiError(400, 'This reset link is not valid or has expired.');

  user.password = await bcrypt.hash(password, 12);
  user.resetPasswordTokenHash = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ message: 'Your password has been updated. You can log in now.' });
});
