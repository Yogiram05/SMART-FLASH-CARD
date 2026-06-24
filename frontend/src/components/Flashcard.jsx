// Reusable flip-card component for review mode.
const Flashcard = ({ question, answer, flipped = false, onToggle, status }) => {
  return (
    <div className="card-3d w-full">
      <button
        type="button"
        onClick={onToggle}
        className="group relative h-[360px] w-full rounded-[2rem] border border-white/10 bg-transparent text-left outline-none"
      >
        <div className={`card-3d-inner relative h-full w-full ${flipped ? 'is-flipped' : ''}`}>
          <div className="card-face absolute inset-0 flex flex-col justify-between rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 shadow-soft">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-400">
              <span>Question</span>
              {status ? <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-slate-200">{status}</span> : null}
            </div>
            <div className="flex flex-1 items-center justify-center">
              <p className="max-w-xl text-center font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {question}
              </p>
            </div>
            <p className="text-center text-sm text-slate-400">Click to reveal the answer</p>
          </div>

          <div className="card-face card-back absolute inset-0 flex flex-col justify-between rounded-[2rem] bg-gradient-to-br from-brand-700 via-indigo-700 to-cyan-600 p-6 shadow-soft">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/70">
              <span>Answer</span>
              {status ? <span className="rounded-full bg-black/20 px-3 py-1 text-[11px] text-white">{status}</span> : null}
            </div>
            <div className="flex flex-1 items-center justify-center">
              <p className="max-w-xl text-center text-2xl font-medium leading-relaxed text-white sm:text-3xl">
                {answer}
              </p>
            </div>
            <p className="text-center text-sm text-white/70">Click to return to the question</p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default Flashcard;
