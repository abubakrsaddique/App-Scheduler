// "use client";
// import { useState } from "react";

// export default function HomePage() {
//   const [tweet, setTweet] = useState("");
//   const [time, setTime] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // Convert datetime-local to "YYYY-MM-DD HH:mm:ss"
//   const formatDateTime = (input: string) => {
//     if (!input) return "";
//     const [date, time] = input.split("T");
//     return `${date} ${time}:00`;
//   };

//   const handleSchedule = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const response = await fetch("http://127.0.0.1:8000/schedule_tweet/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           text: tweet,
//           run_at: formatDateTime(time),
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to schedule tweet");
//       }

//       const data = await response.json();
//       setMessage(data.message || "Tweet scheduled!");
//       setTweet("");
//       setTime("");
//     } catch (err: any) {
//       setMessage(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSchedule}
//         className="bg-white p-6 rounded-2xl shadow-md space-y-4 w-96"
//       >
//         <h1 className="text-xl font-bold text-center">Schedule a Tweet</h1>

//         <textarea
//           value={tweet}
//           onChange={(e) => setTweet(e.target.value)}
//           placeholder="Write your tweet..."
//           className="w-full border p-2 rounded resize-none"
//           rows={4}
//           required
//         />

//         <input
//           type="datetime-local"
//           value={time}
//           onChange={(e) => setTime(e.target.value)}
//           className="w-full border p-2 rounded"
//           required
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
//         >
//           {loading ? "Scheduling..." : "Schedule Tweet"}
//         </button>

//         {message && (
//           <p className="text-center text-sm font-medium text-gray-700">
//             {message}
//           </p>
//         )}
//       </form>
//     </div>
//   );
// }

"use client";
import { useState } from "react";

export default function HomePage() {
  const [tweet, setTweet] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Convert datetime-local to "YYYY-MM-DD HH:mm:ss"
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
      const response = await fetch("http://127.0.0.1:8000/schedule_tweet/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: tweet,
          run_at: formatDateTime(time),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to schedule");

      setMessage(data.message || "Tweet scheduled!");
      setTweet("");
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
          Schedule a Tweet
        </h1>

        <form onSubmit={handleSchedule} className="space-y-4">
          <textarea
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
            placeholder="Write your tweet..."
            className="w-full border p-3 rounded-lg resize-none focus:ring-2 focus:ring-blue-400"
            rows={4}
            required
          />

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
            {loading ? "Scheduling..." : "Schedule Tweet"}
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
