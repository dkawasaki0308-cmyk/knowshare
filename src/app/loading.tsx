export default function HomeLoading() {
  return (
    <div>
      <div className="flex justify-center mb-8">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>

    <div className="animate-pulse">
      <div className="mb-8">
        <div className="h-9 bg-gray-200 rounded-lg w-48 mb-2" />
        <div className="h-5 bg-gray-200 rounded w-40" />
      </div>

      <div className="mb-6">
        <div className="h-11 bg-gray-200 rounded-lg w-full" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="space-y-1.5 mb-3">
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3.5 bg-gray-100 rounded w-16" />
                <div className="h-3.5 bg-gray-100 rounded w-20" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3.5 bg-gray-100 rounded w-10" />
                <div className="h-3.5 bg-gray-100 rounded w-10" />
                <div className="h-5 bg-gray-100 rounded-full w-14" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
