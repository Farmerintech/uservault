import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/provider";
import axios from "axios";
import { BaseURL } from "./api";

interface UserData {
  username: string;
  email: string;
  access_code?: string;
  faceImage:any
}

export const DashboardHome = () => {
  const { state } = useContext(UserContext);
  const [user, setUser] = useState<UserData | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const headers = { Authorization: `Bearer ${state?.user?.token}` };

  useEffect(() => {
    axios
      .get(`${BaseURL}/user/get_user/${state.user.email}`, { headers })
      .then((res) => setUser(res.data.user))
      .catch((err) => setMsg(err.response?.data?.message || "Error fetching user"));
  }, [state.user.username]);

  if (!user) return <p className="text-center mt-10">{msg || "Loading..."}</p>;

  return (
    <div className="p-6 max-w-md mx-auto rounded-xl mt-10">
      <h1 className="md:text-2xl text-lg font-bold mb-4 ">Welcome, {user.username} 👋</h1>
       <div className="flex flex-col gap-5 border-1 border-gray-500 shadow-md px-5 py-5 rounded-[12px] ">
         <img src ={user?.faceImage} className="w-[80px] h-[80px] rounded-full"/>
      <p className="mb-2">
        <span className="font-semibold">Email:</span> {user.email}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Email:</span> {user.username}
      </p>
      
      {/* <p className="mb-2">
        <span className="font-semibold">Access Code:</span>{" "}
        {user.access_code || "Not set"}
      </p> */}
       </div>
    </div>
  );
};