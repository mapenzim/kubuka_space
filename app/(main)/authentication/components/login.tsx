"use client";

import { LoaderPinwheelIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  /**
   * Auto redirect if already logged in
   */
  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  },[status, router, callbackUrl]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl
    });

    if (res?.error) {
      setError('Invalid credentials');
    } else {
      router.push(res?.url ?? "/");
    }
  }

  if (status === "loading") {
    return <p>Loading...</p>
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 w-64 mx-auto mt-8"
    >
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2"
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2"
      />
      <button 
        type="submit"
        className="bg-blue-600 text-white p-2 rounded"
      >
        Login
      </button>
      {error && <p className="text-red-500">{error}</p>}
      <p>
        Don't have an account?{" "} <a href="/register" className="text-blue-500">Register</a>
      </p>
    </form>
  );
}

export default LoginPage;