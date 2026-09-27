"use client";

import { useEffect, useState } from "react";

type Incident = {
  id: string;
  description: string;
  location: string | null;
  people: number;
  category: string | null;
  urgency: string | null;
  key_information: string[] | null;
  guidance: string[] | null;
  created_at: string;
};

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadIncidents() {
      try {
        const response = await fetch("/api/incidents");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load incidents.");
        }

        setIncidents(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load incidents."
        );
      } finally {
        setLoading(false);
      }
    }

    loadIncidents();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <a
          href="/"
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          ← Back to ResQ
        </a>

        <div className="mt-8">
          <h1 className="text-4xl font-bold">
            Incident Dashboard
          </h1>

          <p className="mt-3 text-slate-400">
            View emergency reports analyzed by ResQ.
          </p>
        </div>

        {loading && (
          <p className="mt-10 text-slate-400">
            Loading incidents...
          </p>
        )}

        {error && (
          <div className="mt-10 rounded-xl border border-red-500/40 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && incidents.length === 0 && (
          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
            <p className="text-slate-400">
              No incidents reported yet.
            </p>
          </div>
        )}

        <div className="mt-10 space-y-6">
          {incidents.map((incident) => (
            <article
              key={incident.id}
              className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-wide text-cyan-400">
                    {incident.category?.replace("_", " ") || "Unknown"}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {incident.location || "Location not provided"}
                  </h2>
                </div>

                <span className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-bold uppercase text-red-300">
                  {incident.urgency || "Unknown"}
                </span>
              </div>

              <p className="mt-5 text-slate-300">
                {incident.description}
              </p>

              <p className="mt-4 text-sm text-slate-400">
                People affected: {incident.people}
              </p>

              {incident.key_information &&
                incident.key_information.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold">
                      Key Information
                    </h3>

                    <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
                      {incident.key_information.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {incident.guidance &&
                incident.guidance.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold">
                      General Guidance
                    </h3>

                    <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
                      {incident.guidance.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

              <p className="mt-6 border-t border-slate-700 pt-4 text-xs text-slate-500">
                Reported{" "}
                {new Date(incident.created_at).toLocaleString()}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}