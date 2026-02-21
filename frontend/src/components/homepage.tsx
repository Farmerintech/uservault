import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/provider";
import axios from "axios";
import { BaseURL } from "./api";

interface UserData {
  username: string;
  email: string;
  access_code?: string;
}

export const DashboardHome = () => {
  const { state } = useContext(UserContext);
  const [user, setUser] = useState<UserData | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const headers = { Authorization: `Bearer ${state?.user?.token}` };

  useEffect(() => {
    axios
      .get(`${BaseURL}/get_user/${state.user.username}`, { headers })
      .then((res) => setUser(res.data.user))
      .catch((err) => setMsg(err.response?.data?.message || "Error fetching user"));
  }, [state.user.username]);

  if (!user) return <p className="text-center mt-10">{msg || "Loading..."}</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.username} 👋</h1>
      <p className="mb-2">
        <span className="font-semibold">Email:</span> {user.email}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Access Code:</span>{" "}
        {user.access_code || "Not set"}
      </p>
    </div>
  );
};