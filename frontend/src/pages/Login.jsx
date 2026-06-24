// Login page for existing users.
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, initialized } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialized && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [initialized, isAuthenticated, navigate]);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/users/login', formData);
      login(response.data);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="glass-panel soft-shadow relative overflow-hidden rounded-[2rem] p-8 lg:p-12">
          <div className="absolute inset-0 bg-mesh-glow opacity-80" />
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex rounded-full border border-brand-300/30 bg-brand-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">
              Smart Flashcard Generator
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Study less.
              <br />
              Remember more.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-300">
              Turn your notes into AI-powered flashcards, review them with a clean study loop, and track your progress in one place.
            </p>
            <div className="mt-10 rounded-3xl border border-white/10 bg-slate-900/70 p-5">
              <p className="text-sm font-semibold text-slate-100">What you can do here</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>• Generate flashcards from notes with Python NLP.</li>
                <li>• Save, edit, and delete cards securely with JWT auth.</li>
                <li>• Review cards with a flip animation and status tracking.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="glass-panel soft-shadow rounded-[2rem] p-6 sm:p-10">
          <div className="mx-auto max-w-md">
            <h2 className="font-display text-3xl font-bold text-white">Welcome Back</h2>
            <p className="mt-2 text-sm text-slate-400">Log in to continue your learning journey.</p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30"
                  required
                />
              </div>

              {error ? (
                <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-brand-500 to-indigo-500 px-4 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:from-brand-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Don&apos;t have an account?{' '}
              <Link className="font-semibold text-brand-300 hover:text-brand-200" to="/register">
                Register
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
