import { Notification } from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { publicNotification } from '../utils/serialize.js';

export const listNotifications = asyncHandler(async (req, res) => {
  const items = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ notifications: items.map(publicNotification) });
});

export const markRead = asyncHandler(async (req, res) => {
  const item = await Notification.findOne({ _id: req.params.id, user: req.user._id });
  if (!item) throw new ApiError(404, 'That notification was not found.');
  item.read = true;
  await item.save();
  res.json({ notification: publicNotification(item) });
});

export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.json({ message: 'All notifications marked as read.' });
});
