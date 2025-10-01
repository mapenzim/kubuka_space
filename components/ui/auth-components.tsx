import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "~/app/api/auth/[...nextauth]/route";

export async function SignOut()  {

  const logout = await signOut()

  return (
    <form action={logout}>
      <button 
        className="group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-violet-500 hover:text-orange-200 text-gray-800 cursor-pointer"
        type="button"
      >
        <PowerIcon
          className="mr-2 h-5 w-5 stroke-[2px] fill-[#8B5CF6] stroke-[#C4B5FD]"
          aria-hidden='true'
        />
          Sign Out
      </button>
    </form>
  );
}