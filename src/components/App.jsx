import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from '../context/AppContext';
import AppShell from './Layout/AppShell';
import Login from '../pages/Login';
import FieldSetup from '../pages/FieldSetup';
import FieldOverview from '../pages/FieldOverview';
import FieldDetails from '../pages/FieldDetails';
import DiseaseScan from '../pages/DiseaseScan';
import DiseaseResult from '../pages/DiseaseResult';
import ReportProblem from '../pages/ReportProblem';
import FieldHistory from '../pages/FieldHistory';
import Irrigation from '../pages/Irrigation';
import IrrigationHistory from '../pages/IrrigationHistory';
import YieldForecast from '../pages/YieldForecast';
import Notifications from '../pages/Notifications';
import Profile from '../pages/Profile';
import PropTypes from 'prop-types';

function ProtectedRoute({ children, requireSetup = true }) {
  const { isAuthenticated, setupComplete } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireSetup && !setupComplete) return <Navigate to="/setup" replace />;
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireSetup: PropTypes.bool,
};

function PublicOnly({ children }) {
  const { isAuthenticated, setupComplete } = useApp();
  if (isAuthenticated && setupComplete) return <Navigate to="/app" replace />;
  if (isAuthenticated && !setupComplete) return <Navigate to="/setup" replace />;
  return children;
}

PublicOnly.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * AgroVision app — field-centered farm assistant with mock data.
 */
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="/login"
            element={
              <PublicOnly>
                <Login />
              </PublicOnly>
            }
          />

          <Route
            path="/setup"
            element={
              <ProtectedRoute requireSetup={false}>
                <FieldSetup />
              </ProtectedRoute>
            }
          />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<FieldOverview />} />
            <Route path="field-details" element={<FieldDetails />} />
            <Route path="disease-scan" element={<DiseaseScan />} />
            <Route path="disease-result" element={<DiseaseResult />} />
            <Route path="report-problem" element={<ReportProblem />} />
            <Route path="history" element={<FieldHistory />} />
            <Route path="irrigation" element={<Irrigation />} />
            <Route path="irrigation-history" element={<IrrigationHistory />} />
            <Route path="yield" element={<YieldForecast />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
