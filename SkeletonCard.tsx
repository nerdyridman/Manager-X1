"use client";

export default function SkeletonCard({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-5 border border-gray-100 animate-pulse-subtle"
        >
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
