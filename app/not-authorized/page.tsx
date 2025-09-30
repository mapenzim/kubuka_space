export default function NotAuthorizedPage() {
  return (
    <div className="flex flex-col justify-center h-screen">
      <h1 className="text-2xl font-bold text-red-600">Access denied</h1>
      <p>You don't have permission to view this page.</p>
      <a href="/" className="mt-4 text-blue-600 underline">Go back to home</a>
    </div>
  );
}