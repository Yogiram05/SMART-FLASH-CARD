// Create page that sends notes to the Python AI generator and saves the result.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

const CreateFlashcard = () => {
  const [notes, setNotes] = useState('');
  const [generatedFlashcards, setGeneratedFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/flashcards/generate', { notes });
      setGeneratedFlashcards(response.data.flashcards || []);
      setMessage(`Generated ${response.data.flashcards?.length || 0} flashcards.`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Flashcard generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/flashcards/save', { flashcards: generatedFlashcards });
      setMessage(response.data.message || 'Flashcards saved successfully.');
      setGeneratedFlashcards([]);
      setNotes('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Saving flashcards failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-brand-300/30 bg-brand-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">
              Create Flashcards
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
              Convert study notes into flashcards.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Paste lecture notes, paragraphs, or summaries. The backend sends them to Python for preprocessing, keyword extraction, and flashcard generation.
            </p>
          </div>
          <Link to="/review" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            Review Existing Cards
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[1fr_0.7fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
          <label className="mb-3 block text-sm font-medium text-slate-300" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={14}
            placeholder="Paste your notes here. Example: React uses components, state, and props to build interactive user interfaces..."
            className="w-full rounded-[1.5rem] border border-white/10 bg-slate-900/80 px-4 py-4 text-sm leading-7 text-white placeholder:text-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30"
          />

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !notes.trim()}
              className="rounded-2xl bg-gradient-to-r from-brand-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:from-brand-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Generating...' : 'Generate Flashcards'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || generatedFlashcards.length === 0}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Saving...' : 'Save Flashcards'}
            </button>
          </div>

          {message ? <p className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</p> : null}
          {error ? <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
        </div>

        <aside className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-soft">
          <h2 className="font-display text-2xl font-semibold text-white">How it works</h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">1. Paste notes</p>
              <p className="mt-2">The textarea accepts multiple paragraphs and long study materials.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">2. Python generates cards</p>
              <p className="mt-2">Node.js spawns the Python NLP script and reads its JSON output.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">3. Save to MongoDB</p>
              <p className="mt-2">The generated cards are stored under your authenticated account.</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">Generated Flashcards</h2>
            <p className="mt-1 text-sm text-slate-400">Review the AI output before saving it.</p>
          </div>
          <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-slate-200">
            {generatedFlashcards.length} cards
          </span>
        </div>

        {loading ? <Loader label="Generating flashcards..." /> : null}

        {!loading && generatedFlashcards.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-10 text-center text-sm text-slate-400">
            Your generated flashcards will appear here.
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {generatedFlashcards.map((card, index) => (
            <article key={`${card.question}-${index}`} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-200">Card {index + 1}</p>
              <h3 className="mt-3 font-display text-xl font-semibold text-white">{card.question}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{card.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CreateFlashcard;
