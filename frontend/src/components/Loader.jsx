// Small reusable loading indicator used across pages.
const Loader = ({ label = 'Loading...', fullScreen = false }) => {
  const containerClasses = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center py-10';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-6 py-5 shadow-soft">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-brand-300 border-t-transparent" />
        <p className="text-sm text-slate-300">{label}</p>
      </div>
    </div>
  );
};

export default Loader;
