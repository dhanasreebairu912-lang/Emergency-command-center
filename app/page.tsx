export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-cyan-400">
          AI Emergency Response Assistant
        </p>

        <h1 className="text-6xl font-bold tracking-tight">
          ResQ
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Describe an emergency and turn it into structured information
          that can help communicate the situation clearly.
        </p>

        <a
          href="/report"
          className="mt-8 rounded-xl bg-cyan-500 px-8 py-4 font-bold text-slate-950 transition hover:bg-cyan-400"
        >
          Report an Emergency
        </a>
        <a
  href="/dashboard"
  className="mt-4 rounded-xl border border-slate-700 px-8 py-4 font-bold text-white transition hover:bg-slate-800"
>
  View Incident Dashboard
</a>

        <p className="mt-8 max-w-xl text-sm text-slate-400">
          ResQ does not replace professional emergency services.
          In an emergency, contact the appropriate local emergency service.
        </p>
      </section>
    </main>
  );
}