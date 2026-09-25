import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  initialFarmer,
  initialFields,
  initialIrrigationRecommendations,
  initialIrrigationRecords,
  initialYieldForecasts,
  initialDiseaseScans,
  initialReportedIssues,
  initialFieldActivity,
  initialNotifications,
  mockScanResult,
} from '../data/mockData';

const AppContext = createContext(null);
const AUTH_KEY = 'agrovision_auth';

function loadAuth() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    if (!raw) return { isAuthenticated: false, setupComplete: true };
    return JSON.parse(raw);
  } catch {
    return { isAuthenticated: false, setupComplete: true };
  }
}

function saveAuth(isAuthenticated, setupComplete) {
  sessionStorage.setItem(
    AUTH_KEY,
    JSON.stringify({ isAuthenticated, setupComplete })
  );
}

function formatTodayLabel() {
  return 'Today';
}

function newId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function AppProvider({ children }) {
  const saved = loadAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(saved.isAuthenticated);
  const [setupComplete, setSetupComplete] = useState(saved.setupComplete);
  const [farmer, setFarmer] = useState(initialFarmer);
  const [fields, setFields] = useState(initialFields);
  const [selectedFieldId, setSelectedFieldId] = useState(initialFields[0]?.id ?? null);
  const [irrigationRecommendations, setIrrigationRecommendations] = useState(
    initialIrrigationRecommendations
  );
  const [irrigationRecords, setIrrigationRecords] = useState(initialIrrigationRecords);
  const [yieldForecasts] = useState(initialYieldForecasts);
  const [diseaseScans, setDiseaseScans] = useState(initialDiseaseScans);
  const [reportedIssues, setReportedIssues] = useState(initialReportedIssues);
  const [fieldActivity, setFieldActivity] = useState(initialFieldActivity);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [pendingScanResult, setPendingScanResult] = useState(null);
  const [toast, setToast] = useState(null);

  const selectedField = useMemo(
    () => fields.find((f) => f.id === selectedFieldId) ?? null,
    [fields, selectedFieldId]
  );

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const login = useCallback(() => {
    setIsAuthenticated(true);
    const complete = fields.length > 0;
    setSetupComplete(complete);
    saveAuth(true, complete);
  }, [fields.length]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    saveAuth(false, setupComplete);
  }, [setupComplete]);

  const registerStart = useCallback(() => {
    setIsAuthenticated(true);
    setSetupComplete(false);
    setFields([]);
    setSelectedFieldId(null);
    saveAuth(true, false);
  }, []);

  const completeFieldSetup = useCallback(
    (payload) => {
      const fieldId = newId('field');
      const field = {
        id: fieldId,
        name: payload.fieldName,
        location: payload.location,
        areaAcres: Number(payload.areaAcres),
        crop: payload.crop,
        cropVariety: payload.cropVariety || '',
        soilType: payload.soilType,
        sowingDate: payload.sowingDate,
        cropStage: payload.cropStage,
        cropStageProgress: 40,
        health: 'good',
        healthLabel: 'Good',
      };

      setFarmer((prev) => ({
        ...prev,
        name: payload.farmerName || prev.name,
        location: payload.location || prev.location,
        farmName: payload.farmName || prev.farmName,
      }));

      setFields((prev) => [...prev, field]);
      setSelectedFieldId(fieldId);
      setIrrigationRecommendations((prev) => ({
        ...prev,
        [fieldId]: {
          waterNeededLiters: 250,
          nextWatering: { label: 'Tomorrow', time: '6:00 AM' },
          moisturePercent: 48,
          moistureStatus: 'ok',
          why: 'Watering looks on track for this crop stage. Check again tomorrow morning.',
          upcoming: [
            { id: newId('up'), date: 'Tomorrow', time: '6:00 AM', amountLiters: 250 },
          ],
        },
      }));
      setIrrigationRecords((prev) => ({ ...prev, [fieldId]: [] }));
      setDiseaseScans((prev) => ({ ...prev, [fieldId]: [] }));
      setReportedIssues((prev) => ({ ...prev, [fieldId]: [] }));
      setFieldActivity((prev) => ({
        ...prev,
        [fieldId]: [
          {
            id: newId('act'),
            date: new Date().toISOString().slice(0, 10),
            dateLabel: formatTodayLabel(),
            type: 'stage',
            title: 'Field added',
            detail: `${field.crop} · ${field.areaAcres} acres`,
          },
        ],
      }));
      setSetupComplete(true);
      saveAuth(true, true);
      showToast('Field added successfully');
    },
    [showToast]
  );

  const addActivity = useCallback((fieldId, activity) => {
    setFieldActivity((prev) => ({
      ...prev,
      [fieldId]: [
        {
          id: newId('act'),
          date: new Date().toISOString().slice(0, 10),
          dateLabel: formatTodayLabel(),
          ...activity,
        },
        ...(prev[fieldId] || []),
      ],
    }));
  }, []);

  const saveScanResult = useCallback(
    (fieldId, imagePreview) => {
      const result = {
        id: newId('scan'),
        date: new Date().toISOString().slice(0, 10),
        dateLabel: formatTodayLabel(),
        ...mockScanResult,
        imagePreview,
      };
      setDiseaseScans((prev) => ({
        ...prev,
        [fieldId]: [result, ...(prev[fieldId] || [])],
      }));
      addActivity(fieldId, {
        type: 'disease',
        title: 'Disease scan',
        detail: result.issue,
      });
      setPendingScanResult(null);
      showToast('Scan result saved');
      return result;
    },
    [addActivity, showToast]
  );

  const runMockScan = useCallback((imagePreview) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = { ...mockScanResult, imagePreview };
        setPendingScanResult(result);
        resolve(result);
      }, 1800);
    });
  }, []);

  const reportProblem = useCallback(
    (fieldId, problem) => {
      const entry = {
        id: newId('issue'),
        date: new Date().toISOString().slice(0, 10),
        dateLabel: formatTodayLabel(),
        ...problem,
      };
      setReportedIssues((prev) => ({
        ...prev,
        [fieldId]: [entry, ...(prev[fieldId] || [])],
      }));
      addActivity(fieldId, {
        type: 'problem',
        title: 'Problem reported',
        detail: problem.label,
      });
      showToast('Problem saved');
    },
    [addActivity, showToast]
  );

  const markIrrigationComplete = useCallback(
    (fieldId) => {
      const rec = irrigationRecommendations[fieldId];
      if (!rec) return;
      const amount = rec.waterNeededLiters;
      const entry = {
        id: newId('irr'),
        date: new Date().toISOString().slice(0, 10),
        dateLabel: formatTodayLabel(),
        amountLiters: amount,
        status: 'completed',
        durationMinutes: 45,
      };
      setIrrigationRecords((prev) => ({
        ...prev,
        [fieldId]: [entry, ...(prev[fieldId] || [])],
      }));
      addActivity(fieldId, {
        type: 'irrigation',
        title: 'Irrigation completed',
        detail: `${amount} L`,
      });
      showToast('Irrigation marked complete');
    },
    [addActivity, irrigationRecommendations, showToast]
  );

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const updateFarmer = useCallback((patch) => {
    setFarmer((prev) => ({ ...prev, ...patch }));
    showToast('Profile updated');
  }, [showToast]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const value = {
    isAuthenticated,
    setupComplete,
    farmer,
    fields,
    selectedFieldId,
    selectedField,
    setSelectedFieldId,
    irrigationRecommendations,
    irrigationRecords,
    yieldForecasts,
    diseaseScans,
    reportedIssues,
    fieldActivity,
    notifications,
    unreadCount,
    pendingScanResult,
    setPendingScanResult,
    toast,
    showToast,
    login,
    logout,
    registerStart,
    completeFieldSetup,
    runMockScan,
    saveScanResult,
    reportProblem,
    markIrrigationComplete,
    markNotificationRead,
    markAllNotificationsRead,
    updateFarmer,
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
