"use client";

import { useFormState } from "react-dom";
import { registerUser } from "~/actions/register";

const initialState = { success: false, error: "" };

export default function RegisterForm() {
  const [state, formAction] = useFormState(registerUser, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-sm">
      <input
        type="text"
        name="name"
        placeholder="Name"
        className="border rounded p-2"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="border rounded p-2"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="border rounded p-2"
      />
      <button type="submit" className="bg-blue-600 text-white rounded p-2">
        Register
      </button>

      {state.error && <p className="text-red-500">{state.error}</p>}
      {state.success && <p className="text-green-600">Account created!</p>}
    </form>
  );
}



/*

"use client";

import {  useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitButton } from "./submitbtn";
import { useFormState } from "react-dom";
import { registerUser } from "~/actions/register";

type RegisterResult = {
  success?: boolean;
  error?: string;
};

const initialState: RegisterResult = {};

const Register = () => {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const registerAction = async (
    prevState: RegisterResult,
    formData: FormData
  ): Promise<RegisterResult> => {
    return await registerUser(formData); // call your server action
  };
    
  /**
   * Auto redirect if already logged in
   *
  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  },[status, router, callbackUrl]);

  
   * Loading status on page opening
   *

  if (status === "loading") {
    return <p>Loading...</p>
  }

  const [state, formAction] = useFormState(registerAction, initialState);

  return (
    <form 
      action={formAction}
      className="flex flex-col gap-2 w-64 mx-auto mt-8"
    >
      <input 
        type="text" 
        name="name"
        placeholder="Name"
        className="border p-2"
        required
      />
      <input 
        type="email" 
        name="email"
        placeholder="Email"
        className="border p-2"
        required
      />
      <input 
        type="password" 
        name="password"
        placeholder="Password"
        className="border p-2"
        required
      />
      <SubmitButton />
      {state.error && <p className="text-red-500">{state.error}</p>}
      <p>
        Have an account?{" "} <a href={`/authentication?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-blue-500">Login</a>
      </p>
    </form>
  );

}

export default Register;
*/