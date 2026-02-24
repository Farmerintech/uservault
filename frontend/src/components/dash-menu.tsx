import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
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
  const location = useLocation();
  const { state, dispatch } = useContext(UserContext);

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

  const menuItems = [
    { name: "Home", icon: <BiHome />, path: "/user/dashboard" },
    { name: "Add New File", icon: <MdOutlinePostAdd />, path: "/user/ad_file" },
    { name: "My Files", icon: <BiFile />, path: "/user/my_file" },
    { name: "My Profile", icon: <MdOutlineShoppingBag />, path: "/user/my_profile" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden flex items-center p-3 bg-gray-100 dark:bg-gray-700 shadow">
        <button onClick={toggleMenu}>
          <MdMenu size={30} />
        </button>
        <h2 className="ml-3 font-bold text-xl">
          Secure<span className="text-[#46B35C] text-2xl">Vault</span>
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
            Secure<span className="text-[#46B35C] text-3xl">Vault</span>
          </h2>
          <button className="md:hidden" onClick={toggleMenu}>
            <MdChevronLeft size={25} />
          </button>
        </div>

        <div
          className={`p-3 rounded-l-lg mb-4 ${
            state.theme === "light" ? "bg-stone-50 text-black" : "bg-gray-700 text-white"
          }`}
        >
          {/* <ProfileCard /> */}
        </div>

        <ul>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const activeClass = isActive
              ? "bg-[#46B35C] text-white"
              : state.theme === "light"
              ? "hover:bg-gray-200 text-black"
              : "hover:bg-gray-700 text-white";

            return (
              <Link key={item.name} to={item.path}>
                <li
                  className={`flex items-center gap-3 mb-3 py-3 px-2 rounded-l-lg transition-colors duration-200 ${activeClass}`}
                >
                  {item.icon} {item.name}
                </li>
              </Link>
            );
          })}
        </ul>

        <hr className="my-4 border-gray-300" />
        <p>Account</p>
        <ul className="min-h-screen">
          <li
            className="flex items-center gap-3 mb-3 cursor-pointer hover:text-red-500 transition-colors"
            onClick={Logout}
          >
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