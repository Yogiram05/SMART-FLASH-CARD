// Top navigation for the authenticated portion of the app.
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkBase = 'rounded-full px-4 py-2 text-sm font-medium transition';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 via-indigo-500 to-cyan-400 text-lg font-bold text-white shadow-soft">
            SF
          </div>
          <div>
            <p className="font-display text-base font-semibold text-white">Smart Flashcard Generator</p>
            <p className="text-xs text-slate-400">Study faster. Remember longer.</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
            Dashboard
          </NavLink>
          <NavLink to="/create" className={({ isActive }) => `${linkBase} ${isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
            Create Flashcards
          </NavLink>
          <NavLink to="/review" className={({ isActive }) => `${linkBase} ${isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
            Review
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Logged in as</p>
            <p className="text-sm font-semibold text-slate-100">{user?.name || 'Student'}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
