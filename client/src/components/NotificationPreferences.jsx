import { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Moon, Save, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';

const API_BASE = '';

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/notifications/preferences`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        setPreferences(data.preferences);
        setHasChanges(false);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      addToast('Failed to load notification preferences', 'error');
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/notifications/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
      });
      const data = await response.json();

      if (data.success) {
        setPreferences(data.preferences);
        setHasChanges(false);
        addToast('Notification preferences saved!', 'success');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      addToast('Failed to save preferences', 'error');
    } finally {
      setSaving(false);
    }
  };

  const togglePref = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const updatePref = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
        </CardContent>
      </Card>
    );
  }

  const categories = [
    { key: 'messages', label: 'Messages', desc: 'New messages and replies' },
    { key: 'payments', label: 'Payments', desc: 'Payment received, sent, and updates' },
    { key: 'milestones', label: 'Milestones', desc: 'Deadline reminders and completions' },
    { key: 'uploads', label: 'File Uploads', desc: 'When files are uploaded to your assets' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Notification Preferences</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Choose how and when you want to be notified
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadPreferences}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          {hasChanges && (
            <Button
              onClick={savePreferences}
              loading={saving}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-400" />
            In-App Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map(cat => (
            <label
              key={`in_app_${cat.key}`}
              className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
            >
              <div>
                <p className="font-medium">{cat.label}</p>
                <p className="text-sm text-[var(--text-secondary)]">{cat.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={preferences?.[`in_app_${cat.key}`] ?? true}
                onChange={() => togglePref(`in_app_${cat.key}`)}
                className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
              />
            </label>
          ))}
          <label className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
            <div>
              <p className="font-medium">Mentions</p>
              <p className="text-sm text-[var(--text-secondary)]">When someone mentions you</p>
            </div>
            <input
              type="checkbox"
              checked={preferences?.in_app_mentions ?? true}
              onChange={() => togglePref('in_app_mentions')}
              className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
            <div>
              <p className="font-medium">System Updates</p>
              <p className="text-sm text-[var(--text-secondary)]">Platform updates and announcements</p>
            </div>
            <input
              type="checkbox"
              checked={preferences?.in_app_system ?? true}
              onChange={() => togglePref('in_app_system')}
              className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
            />
          </label>
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map(cat => (
            <label
              key={`email_${cat.key}`}
              className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
            >
              <div>
                <p className="font-medium">{cat.label}</p>
                <p className="text-sm text-[var(--text-secondary)]">Receive email for {cat.label.toLowerCase()}</p>
              </div>
              <input
                type="checkbox"
                checked={preferences?.[`email_${cat.key}`] ?? true}
                onChange={() => togglePref(`email_${cat.key}`)}
                className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
              />
            </label>
          ))}

          {/* Email Digest */}
          <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium">Email Digest</p>
                <p className="text-sm text-[var(--text-secondary)]">Receive a summary of activity</p>
              </div>
              <input
                type="checkbox"
                checked={preferences?.email_digest ?? true}
                onChange={() => togglePref('email_digest')}
                className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
              />
            </label>
            {preferences?.email_digest && (
              <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                <label className="text-sm text-[var(--text-secondary)]">Frequency</label>
                <select
                  value={preferences?.email_digest_frequency || 'daily'}
                  onChange={(e) => updatePref('email_digest_frequency', e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-purple-400" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Receive notifications on your device even when you're not using the app.
          </p>
          {categories.map(cat => (
            <label
              key={`push_${cat.key}`}
              className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
            >
              <div>
                <p className="font-medium">{cat.label}</p>
              </div>
              <input
                type="checkbox"
                checked={preferences?.[`push_${cat.key}`] ?? true}
                onChange={() => togglePref(`push_${cat.key}`)}
                className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
              />
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-yellow-400" />
            Quiet Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] cursor-pointer">
            <div>
              <p className="font-medium">Enable Quiet Hours</p>
              <p className="text-sm text-[var(--text-secondary)]">
                Pause push and email notifications during specified hours
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences?.quiet_hours_enabled ?? false}
              onChange={() => togglePref('quiet_hours_enabled')}
              className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
            />
          </label>

          {preferences?.quiet_hours_enabled && (
            <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-[var(--bg-secondary)]">
              <div>
                <label className="text-sm text-[var(--text-secondary)]">Start Time</label>
                <input
                  type="time"
                  value={preferences?.quiet_hours_start || '22:00'}
                  onChange={(e) => updatePref('quiet_hours_start', e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-sm text-[var(--text-secondary)]">End Time</label>
                <input
                  type="time"
                  value={preferences?.quiet_hours_end || '08:00'}
                  onChange={(e) => updatePref('quiet_hours_end', e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-[var(--text-secondary)]">Timezone</label>
                <select
                  value={preferences?.timezone || 'UTC'}
                  onChange={(e) => updatePref('timezone', e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Central European Time (CET)</option>
                  <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                </select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      {hasChanges && (
        <div className="flex justify-end sticky bottom-4">
          <Button onClick={savePreferences} loading={saving}>
            <Save className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      )}
    </div>
  );
}

export default NotificationPreferences;
