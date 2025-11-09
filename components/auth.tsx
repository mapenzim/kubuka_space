import { signOut } from "@/auth";
import { useRouter } from "next/navigation";

export async function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.refresh(); // 🔥 refresh server components (NavigationBar)
  };
  
  return (
    <form onSubmit={handleSignOut}>
      <button 
        className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium hover:bg-gray-50 transition-colors"
        type="submit"
      >
        Sign out
      </button>
    </form>
  );
}
