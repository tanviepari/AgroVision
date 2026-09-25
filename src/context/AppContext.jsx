import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { api, apiErrorMessage, getToken, setToken } from '../services/api';

const AppContext = createContext(null);

const emptyFieldData = {
  irrigationRecommendations: {},
  irrigationRecords: {},
  yieldForecasts: {},
  diseaseScans: {},
  reportedIssues: {},
  fieldActivity: {},
};

export function AppProvider({ children }) {
  const [authReady, setAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [farmer, setFarmer] = useState(null);
  const [farm, setFarm] = useState(null);
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [weather, setWeather] = useState({ available: false, message: 'Weather information is not available right now.' });
  const [bundle, setBundle] = useState(emptyFieldData);
  const [pendingScanResult, setPendingScanResult] = useState(null);
  const [toast, setToast] = useState(null);
  const [loadingField, setLoadingField] = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const selectedField = useMemo(
    () => fields.find((f) => f.id === selectedFieldId) ?? null,
    [fields, selectedFieldId]
  );

  const setupComplete = fields.length > 0;

  const loadNotifications = useCallback(async () => {
    const { data } = await api.get('/notifications');
    setNotifications(data.notifications);
  }, []);

  const loadFields = useCallback(async () => {
    const [{ data: fieldData }, { data: farmData }] = await Promise.all([
      api.get('/fields'),
      api.get('/farms'),
    ]);
    setFields(fieldData.fields);
    setFarm(farmData.farms[0] || null);
    setSelectedFieldId((current) => {
      if (current && fieldData.fields.some((field) => field.id === current)) return current;
      return fieldData.fields[0]?.id ?? null;
    });
    return fieldData.fields;
  }, []);

  const loadFieldBundle = useCallback(async (fieldId) => {
    if (!fieldId) {
      setBundle(emptyFieldData);
      return;
    }
    setLoadingField(true);
    try {
      const [irrigation, records, forecast, scans, problems, activities, fieldRes] = await Promise.all([
        api.get('/irrigation/recommendation', { params: { fieldId } }),
        api.get('/irrigation/records', { params: { fieldId } }),
        api.get('/yield', { params: { fieldId } }),
        api.get('/scans', { params: { fieldId } }),
        api.get('/problems', { params: { fieldId } }),
        api.get('/activities', { params: { fieldId } }),
        api.get(`/fields/${fieldId}`),
      ]);
      const weatherResponse = await api.get('/weather', {
        params: { location: fieldRes.data.field.location || '' },
      });
      setWeather(weatherResponse.data);
      setBundle({
        irrigationRecommendations: { [fieldId]: irrigation.data.recommendation },
        irrigationRecords: { [fieldId]: records.data.records },
        yieldForecasts: { [fieldId]: forecast.data.forecast },
        diseaseScans: { [fieldId]: scans.data.scans },
        reportedIssues: { [fieldId]: problems.data.reports },
        fieldActivity: { [fieldId]: activities.data.activities },
      });
    } finally {
      setLoadingField(false);
    }
  }, []);

  const refreshAll = useCallback(async (fieldId) => {
    const nextFields = await loadFields();
    await loadNotifications();
    const id = fieldId || selectedFieldId || nextFields[0]?.id;
    if (id) await loadFieldBundle(id);
  }, [loadFields, loadFieldBundle, loadNotifications, selectedFieldId]);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      if (!getToken()) {
        setAuthReady(true);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        if (cancelled) return;
        setFarmer(data.user);
        setIsAuthenticated(true);
        const nextFields = await loadFields();
        await loadNotifications();
        if (nextFields[0]) await loadFieldBundle(nextFields[0].id);
      } catch {
        setToken(null);
        setIsAuthenticated(false);
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, [loadFields, loadFieldBundle, loadNotifications]);

  useEffect(() => {
    if (!authReady || !isAuthenticated || !selectedFieldId) return;
    loadFieldBundle(selectedFieldId).catch(() => {});
  }, [selectedFieldId]); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (contact, password) => {
    const { data } = await api.post('/auth/login', { contact, password });
    setToken(data.token);
    setFarmer(data.user);
    setIsAuthenticated(true);
    const nextFields = await loadFields();
    await loadNotifications();
    if (nextFields[0]) await loadFieldBundle(nextFields[0].id);
    return nextFields.length > 0;
  }, [loadFieldBundle, loadFields, loadNotifications]);

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    setToken(data.token);
    setFarmer(data.user);
    setFields([]);
    setFarm(null);
    setSelectedFieldId(null);
    setIsAuthenticated(true);
    setBundle(emptyFieldData);
    setNotifications([]);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      /* The session is cleared locally even if the server is unreachable. */
    }
    setToken(null);
    setIsAuthenticated(false);
    setFarmer(null);
    setFarm(null);
    setFields([]);
    setSelectedFieldId(null);
    setNotifications([]);
    setBundle(emptyFieldData);
    setPendingScanResult(null);
  }, []);

  const completeFieldSetup = useCallback(async (payload) => {
    const { data } = await api.post('/fields', {
      farmerName: payload.farmerName,
      farmName: payload.farmName,
      farmId: farm?.id,
      name: payload.fieldName,
      location: payload.location,
      areaAcres: Number(payload.areaAcres),
      crop: payload.crop,
      cropVariety: payload.cropVariety,
      soilType: payload.soilType,
      sowingDate: payload.sowingDate,
      cropStage: payload.cropStage,
      notes: payload.notes || '',
    });
    const { data: me } = await api.get('/auth/me');
    setFarmer(me.user);
    await loadFields();
    setSelectedFieldId(data.field.id);
    await loadFieldBundle(data.field.id);
    showToast('Field added successfully');
  }, [farm, loadFieldBundle, loadFields, showToast]);

  const updateField = useCallback(async (fieldId, payload) => {
    await api.patch(`/fields/${fieldId}`, payload);
    await loadFields();
    await loadFieldBundle(fieldId);
    showToast('Field updated');
  }, [loadFieldBundle, loadFields, showToast]);

  const deleteField = useCallback(async (fieldId) => {
    await api.delete(`/fields/${fieldId}`);
    const next = await loadFields();
    if (next[0]) await loadFieldBundle(next[0].id);
    else setBundle(emptyFieldData);
    showToast('Field removed');
  }, [loadFieldBundle, loadFields, showToast]);

  const updateFarmer = useCallback(async (patch) => {
    const { data } = await api.patch('/auth/profile', {
      name: patch.name,
      mobile: patch.contact || patch.mobile,
      email: patch.email,
      location: patch.location,
      state: patch.state,
      district: patch.district,
      preferredLanguage: patch.preferredLanguage,
      notificationPrefs: patch.notificationPrefs,
    });
    setFarmer(data.user);
    if (farm && patch.farmName && patch.farmName !== farm.name) {
      const updated = await api.patch(`/farms/${farm.id}`, {
        name: patch.farmName,
        location: patch.location,
        state: patch.state,
        district: patch.district,
      });
      setFarm(updated.data.farm);
    }
    showToast('Profile updated');
  }, [farm, showToast]);

  const runScan = useCallback(async (fieldId, file) => {
    const form = new FormData();
    form.append('fieldId', fieldId);
    form.append('image', file);
    const { data } = await api.post('/scans/analyse', form);
    setPendingScanResult(data.scan);
    return data.scan;
  }, []);

  const saveScanResult = useCallback(async (scanId) => {
    const { data } = await api.post(`/scans/${scanId}/save`);
    setPendingScanResult(null);
    await loadFieldBundle(data.scan.fieldId);
    await loadFields();
    await loadNotifications();
    showToast('Scan result saved');
    return data.scan;
  }, [loadFieldBundle, loadFields, loadNotifications, showToast]);

  const reportProblem = useCallback(async (fieldId, problem) => {
    const form = new FormData();
    form.append('fieldId', fieldId);
    form.append('category', problem.type);
    form.append('description', problem.description || '');
    if (problem.file) form.append('image', problem.file);
    await api.post('/problems', form);
    await loadFieldBundle(fieldId);
    await loadFields();
    await loadNotifications();
    showToast('Problem saved');
  }, [loadFieldBundle, loadFields, loadNotifications, showToast]);

  const addIrrigationRecord = useCallback(async (fieldId, payload) => {
    await api.post('/irrigation/records', { fieldId, ...payload });
    await loadFieldBundle(fieldId);
    showToast('Irrigation saved');
  }, [loadFieldBundle, showToast]);

  const markIrrigationComplete = useCallback(async (fieldId, scheduleId, amountLiters) => {
    if (scheduleId) {
      await api.post(`/irrigation/schedules/${scheduleId}/complete`, { amountLiters });
    } else {
      await api.post('/irrigation/records', {
        fieldId,
        amountLiters,
        recordedAt: new Date().toISOString(),
      });
    }
    await loadFieldBundle(fieldId);
    await loadNotifications();
    showToast('Irrigation marked complete');
  }, [loadFieldBundle, loadNotifications, showToast]);

  const addIrrigationSchedule = useCallback(async (fieldId, payload) => {
    await api.post('/irrigation/schedules', { fieldId, ...payload });
    await loadFieldBundle(fieldId);
    showToast('Watering plan saved');
  }, [loadFieldBundle, showToast]);

  const loadActivities = useCallback(async (fieldId, filters = {}) => {
    const { data } = await api.get('/activities', { params: { fieldId, ...filters } });
    setBundle((prev) => ({
      ...prev,
      fieldActivity: { ...prev.fieldActivity, [fieldId]: data.activities },
    }));
  }, []);

  const markNotificationRead = useCallback(async (id) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    await api.patch('/notifications/read-all');
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const value = {
    authReady,
    isAuthenticated,
    setupComplete,
    farmer: {
      name: '',
      contact: '',
      email: '',
      location: '',
      state: '',
      district: '',
      preferredLanguage: 'English',
      notificationPrefs: { irrigation: true, disease: true, yield: true },
      ...(farmer || {}),
      farmName: farm?.name || '',
    },
    farm,
    fields,
    selectedFieldId,
    selectedField,
    setSelectedFieldId,
    irrigationRecommendations: bundle.irrigationRecommendations,
    irrigationRecords: bundle.irrigationRecords,
    yieldForecasts: bundle.yieldForecasts,
    diseaseScans: bundle.diseaseScans,
    reportedIssues: bundle.reportedIssues,
    fieldActivity: bundle.fieldActivity,
    notifications,
    unreadCount,
    weather,
    pendingScanResult,
    setPendingScanResult,
    toast,
    showToast,
    loadingField,
    login,
    register,
    logout,
    completeFieldSetup,
    updateField,
    deleteField,
    runScan,
    saveScanResult,
    reportProblem,
    addIrrigationRecord,
    addIrrigationSchedule,
    markIrrigationComplete,
    loadActivities,
    markNotificationRead,
    markAllNotificationsRead,
    updateFarmer,
    apiErrorMessage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
