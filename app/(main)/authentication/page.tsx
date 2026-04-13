import { auth } from "@/auth";
import Authentication from "./components/auth";
import { redirect } from "next/navigation";

const AuthenticationPage = async () => {
  const session = await auth();

  if (!session?.user) return (
    <div className="flex min-h-screen items-center justify-center px-2 md:mt-0 mt-8 bg-linear-to-br dark:from-zinc-800/75 dark:via-gray-800/75 dark:to-zinc-700/75 from-indigo-900 via-sky-800 to-indigo-700">
      <Authentication />
    </div>
  );

  return redirect("/");
}

export default AuthenticationPage;