import { auth } from "@/auth";
import Authentication from "./components/auth";
import { redirect } from "next/navigation";

const AuthenticationPage = async () => {
  const session = await auth();

  if (session?.user) return redirect('/');
  
  return (
    <div className="flex items-center justify-center w-full h-screen pt-8">
      <Authentication />
    </div>
  );
}

export default AuthenticationPage;