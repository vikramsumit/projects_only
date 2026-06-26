export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative card w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const colors = {
    available: 'bg-green-500/20 text-green-400',
    in_use: 'bg-cyber-blue/20 text-cyber-blue',
    maintenance: 'bg-cyber-warning/20 text-cyber-warning',
    offline: 'bg-slate-500/20 text-slate-400',
    active: 'bg-cyber-accent/20 text-cyber-accent',
    completed: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-slate-500/20 text-slate-400',
    suspended: 'bg-cyber-danger/20 text-cyber-danger',
    pending: 'bg-cyber-warning/20 text-cyber-warning',
    confirmed: 'bg-cyber-blue/20 text-cyber-blue',
    open: 'bg-cyber-danger/20 text-cyber-danger',
    investigating: 'bg-cyber-warning/20 text-cyber-warning',
    resolved: 'bg-green-500/20 text-green-400',
    closed: 'bg-slate-500/20 text-slate-400',
    clean: 'bg-green-500/20 text-green-400',
    warning: 'bg-cyber-warning/20 text-cyber-warning',
    infected: 'bg-cyber-danger/20 text-cyber-danger',
    low: 'bg-slate-500/20 text-slate-400',
    medium: 'bg-cyber-warning/20 text-cyber-warning',
    high: 'bg-orange-500/20 text-orange-400',
    critical: 'bg-cyber-danger/20 text-cyber-danger',
    standard: 'bg-slate-500/20 text-slate-400',
    premium: 'bg-purple-500/20 text-purple-400',
    student: 'bg-cyber-blue/20 text-cyber-blue',
  };
  const label = (status || '').replace(/_/g, ' ');
  return <span className={`badge ${colors[status] || 'bg-slate-500/20 text-slate-400'}`}>{label}</span>;
}

export function StatCard({ icon: Icon, label, value, sub, color = 'text-cyber-accent' }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg bg-cyber-surface ${color}`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm text-slate-400 mb-1">{label}</label>
      {children}
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <div className="text-center py-12 text-slate-500">
      <p>{message}</p>
    </div>
  );
}
