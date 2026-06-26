import { useEffect, useState } from 'react';
import { Monitor, Users, DollarSign, ShieldAlert, Clock, Calendar } from 'lucide-react';
import { api, formatCurrency } from '../api/client';
import { StatCard, StatusBadge, PageHeader } from '../components/UI';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  async function load() {
    try {
      setData(await api.dashboard());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8 text-slate-400">Loading dashboard...</div>;
  if (!data) return <div className="p-8 text-cyber-danger">Failed to load dashboard</div>;

  const { stats, revenueWeek, stationUsage, recentIncidents } = data;
  const maxRevenue = Math.max(...revenueWeek.map(r => r.revenue), 1);

  return (
    <div className="p-8">
      <PageHeader
        title="Dashboard"
        subtitle="Real-time overview of your cyber cafe operations"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard icon={Clock} label="Active Sessions" value={stats.active_sessions} color="text-cyber-blue" />
        <StatCard icon={Monitor} label="Available PCs" value={`${stats.available_stations}/${stats.total_stations}`} />
        <StatCard icon={Users} label="Active Members" value={stats.total_members} color="text-purple-400" />
        <StatCard icon={DollarSign} label="Today's Revenue" value={formatCurrency(stats.today_revenue)} color="text-green-400" />
        <StatCard icon={ShieldAlert} label="Open Incidents" value={stats.open_incidents} color="text-cyber-danger" />
        <StatCard icon={Calendar} label="Pending Bookings" value={stats.pending_bookings} color="text-cyber-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="font-semibold mb-4">Revenue (Last 7 Days)</h3>
          {revenueWeek.length === 0 ? (
            <p className="text-slate-500 text-sm">No revenue data yet</p>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {revenueWeek.map(r => (
                <div key={r.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-cyber-accent">{formatCurrency(r.revenue)}</span>
                  <div
                    className="w-full bg-cyber-accent/80 rounded-t"
                    style={{ height: `${(r.revenue / maxRevenue) * 100}%`, minHeight: 4 }}
                  />
                  <span className="text-xs text-slate-500">{r.day.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Recent Security Incidents</h3>
          {recentIncidents.length === 0 ? (
            <p className="text-slate-500 text-sm">No incidents reported</p>
          ) : (
            <div className="space-y-3">
              {recentIncidents.map(inc => (
                <div key={inc.id} className="flex items-center justify-between p-3 bg-cyber-surface rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{inc.title}</p>
                    <p className="text-xs text-slate-500">{inc.station_number || 'N/A'} · {inc.incident_type.replace(/_/g, ' ')}</p>
                  </div>
                  <StatusBadge status={inc.severity} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Station Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {stationUsage.map(st => (
            <div
              key={st.station_number}
              className={`p-3 rounded-lg border text-center ${
                st.status === 'in_use' ? 'border-cyber-blue/50 bg-cyber-blue/5 glow-active' :
                st.status === 'available' ? 'border-green-500/30 bg-green-500/5' :
                'border-cyber-border bg-cyber-surface'
              }`}
            >
              <p className="font-mono text-sm font-bold">{st.station_number}</p>
              <p className="text-xs text-slate-400 truncate">{st.name}</p>
              <div className="mt-2 flex flex-col gap-1 items-center">
                <StatusBadge status={st.status} />
                <StatusBadge status={st.scan_status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
