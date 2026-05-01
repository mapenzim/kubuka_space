"use client"; 

import { useState, useEffect } from "react";

const AddForm  = () => {
  const [form, setForm] = useState({ title: "", content: "", authorId: "" });

  return (
    <form className="flex gap-2 mb-6">
      <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border p-2 rounded" />
      <input placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="border p-2 rounded" />
      <input placeholder="Author ID" value={form.authorId} onChange={(e) => setForm({ ...form, authorId: e.target.value })} className="border p-2 rounded" />
      <button className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
    </form>
  );
}