import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { UserContext } from "../context/provider";
import { BiFile, BiHome } from "react-icons/bi";
import {
  MdChevronLeft,
  MdOutlinePostAdd,
  MdOutlineShoppingBag,
  MdOutlineLogout,
  MdMenu,
} from "react-icons/md";

export const DashMenu = ({ aditiionalStyle }: any) => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);

  // ----------------------
  // Mobile menu toggle
  // ----------------------
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const Logout = () => {
    dispatch({
      type: "Logout",
      payload: { id: "", email: "", username: "", token: "" },
    });
    navigate("/signin");
  };

  const bgClass =
    state.theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white";

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden flex items-center p-3 bg-gray-100 dark:bg-gray-700 shadow">
        <button onClick={toggleMenu}>
          <MdMenu size={30} />
        </button>
        <h2 className="ml-3 font-bold text-xl">
          User<span className="text-purple-800 text-2xl">Vault</span>
        </h2>
      </div>

      {/* Sidebar */}
      <section
        className={`
          fixed top-0 left-0 h-full w-[260px] p-5 shadow-md z-50
          transform transition-transform duration-300
          ${bgClass} ${aditiionalStyle || ""}
          md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-2xl">
            User<span className="text-purple-800 text-3xl">Vault</span>
          </h2>
          <button className="md:hidden" onClick={toggleMenu}>
            <MdChevronLeft size={25} />
          </button>
        </div>

        <div className={`p-3 rounded-l-lg mb-4 ${state.theme === "light" ? "bg-stone-50 text-black" : "bg-gray-700 text-white"}`}>
          {/* <ProfileCard /> */}
        </div>

        <ul>
          <Link to="/user/dashboard">
            <li
              className={`flex items-center gap-3 mb-3 py-3 px-2 rounded-l-lg ${
                state.theme === "light" ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              <BiHome /> Home
            </li>
          </Link>
          <Link to="/user/ad_file">
            <li className="flex items-center gap-3 mb-3">
              <MdOutlinePostAdd /> Add New File
            </li>
          </Link>
          <Link to="/user/my_file">
            <li className="flex items-center gap-3 mb-3">
              <BiFile /> My Files
            </li>
          </Link>
          <Link to="/user/my_profile">
            <li className="flex items-center gap-3 mb-3">
              <MdOutlineShoppingBag /> My Profile
              <span className="bg-purple-500 w-[5px] h-[5px] rounded-full ml-2"></span>
            </li>
          </Link>
        </ul>

        <hr className="my-4 border-gray-300" />
        <p>Account</p>
        <ul className="min-h-screen">
          <li className="flex items-center gap-3 mb-3 cursor-pointer" onClick={Logout}>
            <MdOutlineLogout /> Logout
          </li>
        </ul>
      </section>

      {/* Overlay for mobile when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};