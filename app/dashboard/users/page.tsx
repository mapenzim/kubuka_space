"use client";
import { useEffect, useState } from "react";

const roles = ["ADMIN","EDITOR","USER"];

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER" });

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    const res = await fetch("/api/users");
    setUsers(await res.json());
  }

  async function addUser(e: any) {
    e.preventDefault();
    await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" }
    });
    setForm({ name: "", email: "", password: "", role: "USER" });
    await fetchUsers();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <form onSubmit={addUser} className="flex gap-2 mb-6">
        <input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="border p-2 rounded" />
        <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} className="border p-2 rounded" />
        <input placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} className="border p-2 rounded" />
        <select value={form.role} onChange={(e)=>setForm({...form, role: e.target.value})} className="border p-2 rounded">
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>

      <ul className="space-y-2">
        {users.map(u => (
          <li key={u.id} className="bg-white p-3 shadow rounded flex justify-between">
            <div>
              <div className="font-bold">{u.name} <span className="text-xs ml-2 px-2 py-1 bg-gray-100 rounded">{u.role}</span></div>
              <div className="text-sm text-gray-500">{u.email}</div>
            </div>
            <div className="flex items-center gap-2">
              {/* optionally change role or delete (implement APIs) */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
