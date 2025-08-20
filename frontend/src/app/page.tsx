"use client";
import { useState } from "react";

const APPS = ["Twitter", "Facebook", "Instagram", "LinkedIn"];

export default function HomePage() {
  const [app, setApp] = useState(APPS[0]);
  const [content, setContent] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const formatDateTime = (input: string) => {
    if (!input) return "";
    const [date, time] = input.split("T");
    return `${date} ${time}:00`;
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/schedule_post/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app,
          content,
          run_at: formatDateTime(time),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to schedule");

      setMessage(data.message || `${app} post scheduled!`);
      setContent("");
      setTime("");
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Schedule a Post
        </h1>

        <form onSubmit={handleSchedule} className="space-y-4">
          {/* App selector */}
          <select
            value={app}
            onChange={(e) => setApp(e.target.value)}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            {APPS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Write your ${app} post...`}
            className="w-full border p-3 rounded-lg resize-none focus:ring-2 focus:ring-blue-400"
            rows={4}
            required
          />

          {/* Schedule time */}
          <input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Scheduling..." : `Schedule for ${app}`}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 font-medium text-gray-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
