import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';

const prefForType = {
  irrigation: 'irrigation',
  disease: 'disease',
  yield: 'yield',
  crop: 'yield',
};

export async function notifyUser({ userId, fieldId, type, title, message, link, dedupeKey }) {
  const user = await User.findById(userId).select('notificationPrefs');
  if (!user) return null;
  const prefKey = prefForType[type];
  if (prefKey && user.notificationPrefs?.[prefKey] === false) return null;

  try {
    return await Notification.create({
      user: userId,
      field: fieldId || null,
      type,
      title,
      message,
      link: link || '/app',
      dedupeKey: dedupeKey || '',
    });
  } catch (error) {
    if (error?.code === 11000) return null;
    throw error;
  }
}
