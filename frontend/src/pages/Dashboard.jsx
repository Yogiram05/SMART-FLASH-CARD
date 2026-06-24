// Dashboard page showing flashcard statistics and recent activity.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

const statCardStyles = [
  'from-brand-500/20 to-brand-500/5',
  'from-emerald-500/20 to-emerald-500/5',
  'from-amber-500/20 to-amber-500/5',
  'from-cyan-500/20 to-cyan-500/5'
];

const Dashboard = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFlashcards = async () => {
      try {
        const response = await api.get('/flashcards');
        setFlashcards(response.data.flashcards || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to load flashcards.');
      } finally {
        setLoading(false);
      }
    };

    loadFlashcards();
  }, []);

  const stats = useMemo(() => {
    const total = flashcards.length;
    const known = flashcards.filter((card) => card.status === 'Known').length;
    const notKnown = flashcards.filter((card) => card.status !== 'Known').length;
    const reviewed = flashcards.filter((card) => card.status === 'Known' || card.status === 'Not Known').length;

    return [
      { label: 'Total Flashcards', value: total, detail: 'All cards in your study library' },
      { label: 'Known Cards', value: known, detail: 'Marked as mastered' },
      { label: 'Not Known Cards', value: notKnown, detail: 'Need another review pass' },
      { label: 'Reviewed Cards', value: reviewed, detail: 'Cards with a saved status' }
    ];
  }, [flashcards]);

  const recentFlashcards = flashcards.slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-brand-300/30 bg-brand-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">
              Dashboard
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
              Track your study progress in one place.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              This dashboard shows all flashcards connected to your account, including how many are known, not known, and recently reviewed.
            </p>
          </div>

          <div className="flex gap-3">
            <Link to="/create" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
              Create Flashcards
            </Link>
            <Link to="/review" className="rounded-2xl bg-gradient-to-r from-brand-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:from-brand-400 hover:to-indigo-400">
              Review Now
            </Link>
          </div>
        </div>
      </section>

      {loading ? <Loader label="Loading your flashcards..." /> : null}

      {!loading && error ? (
        <div className="mt-6 rounded-3xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {!loading && !error ? (
        <>
          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <article
                key={stat.label}
                className={`rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${statCardStyles[index]} p-5`}
              >
                <p className="text-sm text-slate-300">{stat.label}</p>
                <p className="mt-3 font-display text-4xl font-bold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-400">{stat.detail}</p>
              </article>
            ))}
          </section>

          <section className="mt-8 grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-white">Recent Flashcards</h2>
                  <p className="mt-1 text-sm text-slate-400">Latest saved cards from your account.</p>
                </div>
                <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-slate-200">
                  {flashcards.length} total
                </span>
              </div>

              <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
                <div className="grid grid-cols-12 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  <div className="col-span-6 sm:col-span-7">Question</div>
                  <div className="col-span-3 sm:col-span-2">Status</div>
                  <div className="col-span-3 sm:col-span-3 text-right">Created</div>
                </div>
                <div className="divide-y divide-white/5">
                  {recentFlashcards.length > 0 ? recentFlashcards.map((card) => (
                    <div key={card._id} className="grid grid-cols-12 items-center px-4 py-4 text-sm text-slate-200">
                      <div className="col-span-6 pr-3 sm:col-span-7">
                        <p className="truncate font-medium text-white">{card.question}</p>
                        <p className="mt-1 truncate text-xs text-slate-400">{card.answer}</p>
                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${card.status === 'Known' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                          {card.status}
                        </span>
                      </div>
                      <div className="col-span-3 text-right text-xs text-slate-400 sm:col-span-3">
                        {card.createdAt ? new Date(card.createdAt).toLocaleDateString() : 'Recently'}
                      </div>
                    </div>
                  )) : (
                    <div className="px-4 py-10 text-center text-sm text-slate-400">
                      No flashcards yet. Generate your first set from the Create page.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-soft">
              <h2 className="font-display text-2xl font-semibold text-white">Quick Actions</h2>
              <div className="mt-5 space-y-4">
                <Link to="/create" className="block rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-brand-300/30 hover:bg-brand-500/10">
                  <p className="font-semibold text-white">Generate cards from notes</p>
                  <p className="mt-2 text-sm text-slate-400">Paste your notes and let Python NLP extract useful flashcards.</p>
                </Link>
                <Link to="/review" className="block rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-brand-300/30 hover:bg-brand-500/10">
                  <p className="font-semibold text-white">Start a review session</p>
                  <p className="mt-2 text-sm text-slate-400">Flip through your cards, mark status, and keep momentum.</p>
                </Link>
              </div>
            </aside>
          </section>
        </>
      ) : null}
    </div>
  );
};

export default Dashboard;
