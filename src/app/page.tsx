import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  const { q, tag } = await searchParams;

  const articles = await prisma.article.findMany({
    where: {
      published: true,
      ...(q && {
        OR: [{ title: { contains: q } }, { content: { contains: q } }],
      }),
      ...(tag && { tags: { some: { tag: { name: tag } } } }),
    },
    include: {
      author: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ナレッジベース</h1>
        <p className="text-gray-500">チームの知識を共有しよう</p>
      </div>

      <form className="mb-6" method="GET">
        <input
          name="q"
          defaultValue={q}
          placeholder="記事を検索..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </form>

      {tag && (
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <span>タグ: </span>
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            {tag}
          </span>
          <Link href="/" className="text-gray-400 hover:text-gray-600 ml-1">
            ✕ 解除
          </Link>
        </div>
      )}

      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">まだ記事がありません</p>
          <Link href="/articles/new" className="text-blue-600 hover:underline mt-2 inline-block">
            最初の記事を書いてみましょう →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{article.title}</h2>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                {article.content.replace(/[#*`[\]()!>]/g, "").slice(0, 120)}...
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-3">
                  <span>{article.author.name ?? "匿名"}</span>
                  <span>{new Date(article.createdAt).toLocaleDateString("ja-JP")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>❤️ {article._count.likes}</span>
                  <span>💬 {article._count.comments}</span>
                  <div className="flex gap-1">
                    {article.tags.map(({ tag }) => (
                      <span
                        key={tag.id}
                        className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
