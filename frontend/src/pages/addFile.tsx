import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { UserContext } from "../context/provider";
import { DashMenu } from "../components/dash-menu";
import FileManager from "../components/createFile";
import { BaseURL } from "../components/api";

export const AddFile = () => {
  const { state } = useContext(UserContext);
  const navigate = useNavigate();

  const token = state?.user?.token;

  const [setData] = useState<any>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ----------------------
  // Check JWT token
  // ----------------------
  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded?.exp && decoded.exp < currentTime) {
        navigate("/signin");
      }
    } catch (error) {
      console.error("Token decode error:", error);
      navigate("/signin");
    }
  }, [token, navigate]);

  // ----------------------
  // Fetch user profile
  // ----------------------
  useEffect(() => {
    if (!state?.user?.username) return;

    axios
      .get(`${BaseURL}/user/get_user/${state.user.email}`, { headers })
      .then((response) => {
        setData(response.data.user);
      })
      .catch((error) => {
        setMsg(error.response?.data?.message || "Failed to fetch profile");
        console.error(error);
      });
  }, [state?.user?.username, headers]);

  // ----------------------
  // Render
  // ----------------------
  const themeClasses =
    state?.theme === "light"
      ? "bg-stone-50 text-black"
      : "bg-gray-700 text-white";

  return (
    <>
      {msg && <p className="text-center text-red-500 hidden">{msg}</p>}

      <section className={`${themeClasses} hidden md:flex justify-between min-h-screen`}>
        <DashMenu />
            <main className="flex flex-col gap-5 lg:w-[50%] md:w-[40%] p-5 md:pt-5 relative lg:left-[22%] md:left-[32%]">

        <FileManager/>
        </main>
      </section>

      <section className={`${themeClasses} md:hidden justify-between min-h-screen`}>
                <DashMenu />

        <FileManager/>
      </section>
    </>
  );
};