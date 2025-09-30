import LoginPage from "./components/login";

const Page = () => {
  return (
    <div className="bg-gray-300 rounded-2xl p-6 w-[50%] h-[80%] shadow-lg">
      <h2 className="text-center text-2xl text-indigo-600 font-bold">Sign In</h2>
      <LoginPage />
    </div>
  );
}

export default Page;