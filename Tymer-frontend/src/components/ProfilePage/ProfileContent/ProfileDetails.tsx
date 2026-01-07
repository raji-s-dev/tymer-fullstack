import { useUserStore } from "../../../store/useUserStore";

export default function ProfileDetails() {
  const { user } = useUserStore();

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Profile</h2>

      <div className="space-y-5">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="text-lg font-medium">{user.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-medium">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
