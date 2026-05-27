"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";

type Author = { id: string; name: string | null; image: string | null };
type Comment = {
  id: string;
  content: string;
  createdAt: Date | string;
  author: Author;
};
type Tag = { tag: { id: string; name: string } };
type Article = {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  author: Author & { bio?: string | null };
  tags: Tag[];
  comments: Comment[];
  _count: { likes: number };
  authorId: string;
};

export default function ArticleDetail({ article }: { article: Article }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [likes, setLikes] = useState(article._count.likes);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>(article.comments);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function toggleLike() {
    if (!session) return alert("いいねするにはログインが必要です");
    const res = await fetch(`/api/articles/${article.id}/likes`, { method: "POST" });
    const data = await res.json();
    setLiked(data.liked);
    setLikes((prev) => (data.liked ? prev + 1 : prev - 1));
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return alert("コメントするにはログインが必要です");
    setSubmitting(true);
    const res = await fetch(`/api/articles/${article.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentText }),
    });
    if (res.ok) {
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    }
    setSubmitting(false);
  }

  async function deleteArticle() {
    if (!confirm("この記事を削除しますか？")) return;
    await fetch(`/api/articles/${article.id}`, { method: "DELETE" });
    router.push("/");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-2">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← 記事一覧
        </Link>
      </div>

      <article className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

        <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">{article.author.name ?? "匿名"}</span>
            <span>·</span>
            <span>{new Date(article.createdAt).toLocaleDateString("ja-JP")}</span>
          </div>
          {session?.user.id === article.authorId && (
            <button
              onClick={deleteArticle}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              削除
            </button>
          )}
        </div>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map(({ tag }) => (
              <Link
                key={tag.id}
                href={`/?tag=${encodeURIComponent(tag.name)}`}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        <div className="prose prose-gray max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
              liked
                ? "border-red-200 bg-red-50 text-red-500"
                : "border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 text-gray-500"
            }`}
          >
            ❤️ {likes}
          </button>
        </div>
      </article>

      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          コメント ({comments.length})
        </h2>
        <div className="space-y-4 mb-6">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                {c.author.name?.[0] ?? "?"}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-800">{c.author.name ?? "匿名"}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString("ja-JP")}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
        {session ? (
          <form onSubmit={submitComment} className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="コメントを追加..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              送信
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-400">
            コメントするには{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              ログイン
            </Link>{" "}
            してください
          </p>
        )}
      </section>
    </div>
  );
}
