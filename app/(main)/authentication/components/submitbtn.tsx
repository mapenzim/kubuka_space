"use client";

import { useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit"
      disabled={pending}
      className={`p-2 rounded text-white ${pending ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
    >
      {pending ? "registering..." : "Register"}
    </button>
  );
}

export { SubmitButton };