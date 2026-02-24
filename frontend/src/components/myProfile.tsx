import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/provider";
import { BaseURL } from "./api";

interface User {
user:any;
  username: string;
  email: string;
}

interface UpdateResponse {
  message: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState<string>("");
  const [updateMessage, setUpdateMessage] = useState<string>("");
 const { state } = useContext(UserContext);
  const token = state?.user?.token;
  const email =state?.user?.email;
  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${BaseURL}/user/get_user/${email}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch user: ${res.statusText}`);
        }

        const data: User = await res.json();
        setUser(data.user);
        setNameInput(data.user.username); // prefill update field
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [email, token]);

  // Handle name update
  const handleUpdate = async () => {
    if (!nameInput) return;

    try {
      const res = await fetch(`${BaseURL}/update_user/${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: nameInput }),
      });

      const data: UpdateResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      setUpdateMessage(data.message);
      setUser((prev) => (prev ? { ...prev, name: nameInput } : prev));
    } catch (err: any) {
      console.error(err);
      setUpdateMessage(err.message);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-md mx-auto p-5 rounded shadow-md mt-5">
      <h1 className="text-2xl font-bold mb-3">My Profile</h1>

      {/* Display profile info */}
      <div className="mb-5">
        <p>
          <strong>Name:</strong> {user?.username}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
      </div>

      {/* Update section */}
      <div className="border-t pt-4">
        <h2 className="font-semibold mb-2">Update Name</h2>
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={handleUpdate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update
        </button>
        {updateMessage && (
          <p className="mt-2 text-green-600">{updateMessage}</p>
        )}
      </div>
    </div>
  );
}