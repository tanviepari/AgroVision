import { stageProgress, formatDateLabel, relativeTime } from '../utils/dates.js';

export function publicUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    contact: user.mobile,
    mobile: user.mobile,
    email: user.email || '',
    location: user.location,
    state: user.state,
    district: user.district,
    preferredLanguage: user.preferredLanguage,
    notificationPrefs: user.notificationPrefs,
  };
}

export function publicFarm(farm) {
  return {
    id: String(farm._id),
    name: farm.name,
    location: farm.location,
    state: farm.state,
    district: farm.district,
  };
}

export function publicField(field, health = { health: 'unchecked', healthLabel: 'Not checked' }) {
  return {
    id: String(field._id),
    farmId: String(field.farm),
    name: field.name,
    crop: field.crop,
    cropVariety: field.cropVariety || '',
    areaAcres: field.areaAcres,
    soilType: field.soilType,
    sowingDate: new Date(field.sowingDate).toISOString().slice(0, 10),
    location: field.location,
    cropStage: field.cropStage,
    cropStageProgress: stageProgress(field.cropStage),
    notes: field.notes || '',
    health: health.health,
    healthLabel: health.healthLabel,
  };
}

export function publicActivity(item) {
  return {
    id: String(item._id),
    fieldId: String(item.field),
    type: item.type,
    title: item.title,
    detail: item.detail,
    date: new Date(item.occurredAt).toISOString().slice(0, 10),
    dateLabel: formatDateLabel(item.occurredAt),
  };
}

export function publicNotification(item) {
  return {
    id: String(item._id),
    type: item.type,
    title: item.title,
    message: item.message,
    read: item.read,
    fieldId: item.field ? String(item.field) : null,
    link: item.link,
    time: relativeTime(item.createdAt),
  };
}
