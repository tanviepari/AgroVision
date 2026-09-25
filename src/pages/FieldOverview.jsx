import { Link, useNavigate } from 'react-router-dom';
import {
  ScanLine,
  Droplets,
  Wheat,
  AlertCircle,
  ChevronRight,
  Sprout,
} from 'lucide-react';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import ProgressBar from '../components/common/ProgressBar';
import FieldSelector from '../components/layout/FieldSelector';
import EmptyState from '../components/common/EmptyState';
import { useApp } from '../context/AppContext';

const activityIcons = {
  scan: ScanLine,
  disease: ScanLine,
  problem: AlertCircle,
  irrigation: Droplets,
  yield: Wheat,
  stage: Sprout,
  recommendation: Droplets,
};

export default function FieldOverview() {
  const navigate = useNavigate();
  const {
    fields,
    selectedField,
    selectedFieldId,
    irrigationRecommendations,
    yieldForecasts,
    fieldActivity,
    reportedIssues,
  } = useApp();

  if (!fields.length || !selectedField) {
    return (
      <EmptyState
        icon="sprout"
        title="No fields yet"
        description="Add your first field to start tracking crop health, water, and yield."
        actionLabel="Set up a field"
        onAction={() => navigate('/setup')}
      />
    );
  }

  const irrigation = irrigationRecommendations[selectedFieldId];
  const yieldData = yieldForecasts[selectedFieldId];
  const activity = (fieldActivity[selectedFieldId] || []).slice(0, 5);
  const recentIssue = (reportedIssues[selectedFieldId] || [])[0];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-wider text-text-light uppercase mb-1">
          Field Overview
        </p>
        <FieldSelector />
      </div>

      {/* Status strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="!p-5">
          <p className="text-xs font-medium text-text-light uppercase tracking-wide">
            Crop health
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div
              className={`h-12 w-12 rounded-full flex items-center justify-center ${
                selectedField.health === 'good'
                  ? 'bg-success-soft text-success'
                  : selectedField.health === 'attention'
                    ? 'bg-warning-soft text-warning'
                    : 'bg-alert-soft text-alert'
              }`}
            >
              <Sprout size={22} />
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-primary">
                {selectedField.healthLabel}
              </p>
              <StatusBadge status={selectedField.health} label={selectedField.healthLabel} />
            </div>
          </div>
        </Card>

        <Card className="!p-5">
          <p className="text-xs font-medium text-text-light uppercase tracking-wide">
            Irrigation
          </p>
          <p className="mt-2 text-sm text-warning font-medium">Water needed today</p>
          <p className="font-serif text-3xl font-bold text-primary mt-1">
            {irrigation?.waterNeededLiters ?? '—'}{' '}
            <span className="text-lg font-sans font-semibold">L</span>
          </p>
        </Card>

        <Card className="!p-5">
          <p className="text-xs font-medium text-text-light uppercase tracking-wide">
            Expected yield
          </p>
          <p className="font-serif text-3xl font-bold text-primary mt-3">
            {yieldData?.expectedTonnes ?? '—'}{' '}
            <span className="text-lg font-sans font-semibold">tonnes</span>
          </p>
        </Card>

        <Card className="!p-5">
          <p className="text-xs font-medium text-text-light uppercase tracking-wide">
            Crop stage
          </p>
          <p className="mt-2 font-semibold text-text-dark">{selectedField.cropStage}</p>
          <ProgressBar
            className="mt-3"
            value={selectedField.cropStageProgress}
            color="earth"
            height="h-2"
          />
          <p className="mt-1 text-xs text-text-light">{selectedField.cropStageProgress}%</p>
        </Card>
      </div>

      {/* Recent issue */}
      {recentIssue && (
        <Card className="!p-4 flex items-center gap-3 bg-warning-soft/40 border-warning/10">
          <AlertCircle className="text-warning shrink-0" size={20} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-dark">
              {recentIssue.label} reported {recentIssue.dateLabel.toLowerCase()}
            </p>
            {recentIssue.description && (
              <p className="text-xs text-text-light truncate">{recentIssue.description}</p>
            )}
          </div>
          <Link
            to="/app/history"
            className="text-sm font-medium text-primary hover:underline shrink-0"
          >
            View
          </Link>
        </Card>
      )}

      {/* Quick actions */}
      <section>
        <h2 className="font-serif text-xl font-bold text-primary mb-4">Quick actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { to: '/app/disease-scan', label: 'Scan Crop', icon: ScanLine, color: 'bg-primary-soft text-primary' },
            { to: '/app/irrigation', label: 'Check Water', icon: Droplets, color: 'bg-water-soft text-water' },
            { to: '/app/yield', label: 'View Yield', icon: Wheat, color: 'bg-earth-soft text-earth' },
            { to: '/app/report-problem', label: 'Report Problem', icon: AlertCircle, color: 'bg-warning-soft text-warning' },
          ].map(({ to, label, icon: Icon, color }) => (
            <Link key={to} to={to}>
              <Card className="!p-5 h-full hover:shadow-md transition-shadow group">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
                  <Icon size={20} />
                </div>
                <p className="mt-3 font-semibold text-text-dark group-hover:text-primary transition-colors">
                  {label}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold text-primary">Recent activity</h2>
          <Link
            to="/app/history"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            Full history <ChevronRight size={14} />
          </Link>
        </div>
        <Card padding={false}>
          {activity.length === 0 ? (
            <EmptyState
              title="No activity yet"
              description="Scans, watering, and updates will show up here."
            />
          ) : (
            <ul className="divide-y divide-border">
              {activity.map((item) => {
                const Icon = activityIcons[item.type] || Sprout;
                return (
                  <li key={item.id} className="flex items-start gap-3 px-5 py-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-dark">{item.title}</p>
                      <p className="text-xs text-text-light mt-0.5">{item.detail}</p>
                    </div>
                    <span className="text-xs text-text-light shrink-0">{item.dateLabel}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </section>

      <div className="text-center">
        <Link
          to="/app/field-details"
          className="text-sm font-medium text-primary hover:underline"
        >
          View full field details →
        </Link>
      </div>
    </div>
  );
}
