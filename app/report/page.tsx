"use client";

import { FormEvent, useState } from "react";

type Analysis = {
  category: string;
  urgency: string;
  key_information: string[];
  guidance: string[];
};

export default function ReportPage() {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [people, setPeople] = useState(1);

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          location,
          people,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setAnalysis(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to analyze the emergency."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <a
          href="/"
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          ← Back to ResQ
        </a>

        <h1 className="mt-8 text-4xl font-bold">
          Report an Emergency
        </h1>

        <p className="mt-3 text-slate-400">
          Describe what happened as clearly as possible.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block font-medium">
              What happened?
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 outline-none focus:border-cyan-400"
              placeholder="Example: A person was injured in a bicycle accident and is bleeding..."
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Location
            </label>

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 outline-none focus:border-cyan-400"
              placeholder="Example: Gachibowli, Hyderabad"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              People affected
            </label>

            <input
              type="number"
              min="1"
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Emergency"}
          </button>
        </form>

        {error && (
          <div className="mt-8 rounded-xl border border-red-500/40 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        )}

        {analysis && (
          <section className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">
              AI Analysis
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">
                  Category
                </p>
                <p className="mt-1 text-lg font-semibold capitalize">
                  {analysis.category.replace("_", " ")}
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">
                  Urgency
                </p>
                <p className="mt-1 text-lg font-semibold uppercase">
                  {analysis.urgency}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold">
                Key Information
              </h3>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
                {analysis.key_information.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold">
                General Guidance
              </h3>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
                {analysis.guidance.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <p className="mt-6 border-t border-slate-700 pt-4 text-sm text-slate-400">
              ResQ provides AI-assisted information only. It does not
              replace professional emergency services or medical advice.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}