import { auth } from "@/auth";
import Authentication from "./components/auth";
import { redirect } from "next/navigation";

const AuthenticationPage = async () => {
  const session = await auth();

  if (session?.user) return redirect('/');
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-900 via-sky-800 to-indigo-700">
      <Authentication />
    </div>
  );
}

export default AuthenticationPage;