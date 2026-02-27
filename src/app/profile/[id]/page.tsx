export default async function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p className="text-2xl text-white">
        This is the profile page for user ID:
        <span className=" p-2 rounded bg-orange-400 text-white hover:bg-orange-500">
          {id}
        </span>
      </p>
    </div>
  );
}
