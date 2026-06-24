// Review page with flip interaction and progress controls.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import Flashcard from '../components/Flashcard';

const ReviewFlashcard = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [message, setMessage] = useState('');
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

  const currentFlashcard = flashcards[currentIndex] || null;
  const progress = useMemo(() => {
    if (flashcards.length === 0) {
      return 0;
    }
    return ((currentIndex + 1) / flashcards.length) * 100;
  }, [currentIndex, flashcards.length]);

  const goToNextCard = () => {
    setFlipped(false);
    setCurrentIndex((current) => (current + 1 < flashcards.length ? current + 1 : 0));
  };

  const updateCardStatus = async (status) => {
    if (!currentFlashcard) {
      return;
    }

    setSavingStatus(true);
    setMessage('');
    setError('');

    try {
      const response = await api.put(`/flashcards/${currentFlashcard._id}`, { status });
      const updatedCard = response.data.flashcard;

      setFlashcards((currentCards) => currentCards.map((card) => (card._id === updatedCard._id ? updatedCard : card)));
      setMessage(`Marked as ${status}.`);
      goToNextCard();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to update flashcard status.');
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading) {
    return <Loader label="Loading review deck..." />;
  }

  if (error && flashcards.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-rose-500/30 bg-rose-500/10 p-8 text-rose-100">
          <p className="font-semibold">Unable to load flashcards.</p>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-soft">
          <h1 className="font-display text-3xl font-bold text-white">No flashcards to review</h1>
          <p className="mt-3 text-slate-400">Generate some cards first, then come back here to practice.</p>
          <Link to="/create" className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-brand-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white">
            Create Flashcards
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-brand-300/30 bg-brand-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">
              Review Flashcards
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
              Flip, judge, and move to the next card.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
              Use the buttons below to mark each flashcard as known or not known. Your progress is saved back to MongoDB.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-4 text-sm text-slate-300">
            Card {currentIndex + 1} of {flashcards.length}
          </div>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-500 via-indigo-500 to-cyan-400 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[1fr_0.36fr]">
        <Flashcard
          question={currentFlashcard.question}
          answer={currentFlashcard.answer}
          flipped={flipped}
          status={currentFlashcard.status}
          onToggle={() => setFlipped((current) => !current)}
        />

        <aside className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-soft">
          <h2 className="font-display text-2xl font-semibold text-white">Review Controls</h2>
          <p className="mt-2 text-sm text-slate-400">Your selection updates the flashcard status immediately.</p>

          <div className="mt-6 space-y-4">
            <button
              type="button"
              onClick={() => updateCardStatus('Known')}
              disabled={savingStatus}
              className="w-full rounded-2xl bg-emerald-500/15 px-5 py-4 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Known
            </button>
            <button
              type="button"
              onClick={() => updateCardStatus('Not Known')}
              disabled={savingStatus}
              className="w-full rounded-2xl bg-amber-500/15 px-5 py-4 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/25 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Not Known
            </button>
            <button
              type="button"
              onClick={goToNextCard}
              disabled={savingStatus}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Next
            </button>
          </div>

          {message ? <p className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</p> : null}
          {error ? <p className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Current status</p>
            <p className="mt-2 text-lg font-semibold text-white">{currentFlashcard.status}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Click the card itself to flip between question and answer before choosing a status.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default ReviewFlashcard;
