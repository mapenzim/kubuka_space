"use client";

import { useFormState } from "react-dom";
import { registerUser } from "~/actions/data-actions";

const initialState = { success: false, error: "" };
/**
 * 
 * @returns the form 
 */
export default function RegisterForm() {
  const [state, formAction] = useFormState(registerUser, initialState);

  return (
    <form action={formAction}>
      <input type="text" name="name" placeholder="Name" />
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Register</button>

      {!state.success && state.error && (
        <p className="text-red-500">{state.error}</p>
      )}
    </form>
  );
}
