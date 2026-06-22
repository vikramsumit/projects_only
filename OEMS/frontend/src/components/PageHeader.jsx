const PageHeader = ({ title, subtitle }) => (
  <div className="mb-5">
    <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
    {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
  </div>
);

export default PageHeader;
