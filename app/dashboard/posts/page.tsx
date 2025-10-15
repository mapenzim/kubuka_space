"use client";
import { useEffect, useState } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", content: "", authorId: "" });

  useEffect(() => {
    fetch("/api/posts").then((res) => res.json()).then(setPosts);
  }, []);

  async function addPost(e: any) {
    e.preventDefault();
    await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });
    setForm({ title: "", content: "", authorId: "" });
    const res = await fetch("/api/posts");
    setPosts(await res.json());
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Posts</h1>

      <form onSubmit={addPost} className="flex gap-2 mb-6">
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border p-2 rounded" />
        <input placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="border p-2 rounded" />
        <input placeholder="Author ID" value={form.authorId} onChange={(e) => setForm({ ...form, authorId: e.target.value })} className="border p-2 rounded" />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
      </form>

      <ul className="space-y-2">
        {posts.map((p) => (
          <li key={p.id} className="bg-white p-3 shadow rounded">
            <strong>{p.title}</strong> — {p.content}
            <div className="text-sm text-gray-500">By: {p.author?.name ?? "Unknown"}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
