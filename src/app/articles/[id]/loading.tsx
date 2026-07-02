export default function ArticleLoading() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-center mb-8">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>

    <div className="animate-pulse">
      <div className="mb-2">
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>

      <article className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
        <div className="h-9 bg-gray-200 rounded w-4/5 mb-4" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-100 rounded w-24" />
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <div className="h-6 bg-blue-100 rounded-full w-16" />
          <div className="h-6 bg-blue-100 rounded-full w-20" />
        </div>

        <div className="space-y-3">
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-4/5" />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="h-10 bg-gray-100 rounded-full w-20" />
        </div>
      </article>

      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-3.5 bg-gray-200 rounded w-16" />
                  <div className="h-3 bg-gray-100 rounded w-20" />
                </div>
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    </div>
  );
}
