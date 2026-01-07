import { useEffect, useState } from "react";


export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    fetch("http://localhost:5000/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
        else window.location.href = "/";
      });
  }, []);

  if (!user)
    return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-10">
      <div className="bg-white shadow-xl p-10 rounded-xl w-full max-w-lg text-center">

        <img
          src={user.picture}
          className="w-24 h-24 rounded-full mx-auto mb-4"
          alt="Profile"
        />

        <h1 className="text-3xl font-bold">{user.name}</h1>
        <p className="text-lg text-gray-500">{user.email}</p>

        <button
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Logout
        </button>

      </div>
    </div>
  );
}
