import { auth } from "@/auth";
import Authentication from "./components/auth";
import { redirect } from "next/navigation";

const AuthenticationPage = async () => {
  const session = await auth();

  if (session) return redirect('/');
  
  return (
    <div className="pt-8">
      <Authentication />
    </div>
  );
}

export default AuthenticationPage;