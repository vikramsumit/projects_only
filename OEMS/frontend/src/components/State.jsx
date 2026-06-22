export const Loading = ({ text = 'Loading...' }) => (
  <div className="card text-sm text-slate-500">{text}</div>
);

export const Empty = ({ text = 'No records found.' }) => (
  <div className="card text-sm text-slate-500">{text}</div>
);

export const Alert = ({ type = 'error', children }) => {
  const styles = type === 'success'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-red-200 bg-red-50 text-red-700';
  return <div className={`rounded-md border px-3 py-2 text-sm ${styles}`}>{children}</div>;
};
