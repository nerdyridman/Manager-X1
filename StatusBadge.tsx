"use client";

const statusColors: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-700",
  injured: "bg-red-100 text-red-700",
  suspended: "bg-amber-100 text-amber-700",
  resting: "bg-blue-100 text-blue-700",
  upcoming: "bg-blue-100 text-blue-700",
  live: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-600",
  training: "bg-indigo-100 text-indigo-700",
  meeting: "bg-purple-100 text-purple-700",
  social: "bg-pink-100 text-pink-700",
  travel: "bg-cyan-100 text-cyan-700",
  medical: "bg-red-100 text-red-700",
  other: "bg-gray-100 text-gray-700",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
        statusColors[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
