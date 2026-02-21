import { BiFile, BiHome } from "react-icons/bi"
import {
    MdChevronLeft,
    MdOutlinePostAdd,
    MdOutlineShoppingBag,
    MdOutlineLogout,
} from "react-icons/md"
import { useContext } from "react"
import { Link, useNavigate } from "react-router"
import { UserContext } from "../context/provider"
export const DashMenu = ({ aditiionalStyle }: any) => {
    const navigate = useNavigate()
    const User = {
        id: "",
        email: "",
        username: "",
        token: ""
    };
    const { state, dispatch } = useContext(UserContext)
    const Logout = () => {

        dispatch({ type: "Logout", payload: User })
        navigate('/login')
    }
    return (
        <>
            <section className={` ${state.theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white"} w-[100%] md:w-[260px] p-5 shadow-md min-h-screen fixed left-0 ${aditiionalStyle}`}>
                <h2 className="font-bold text-2xl">User<span className="text-purple-800 text-3xl">Vault</span></h2>
                <div className="flex">
                    <div className="border-b border-gray-300 my-4 w-[100%]"></div>
                    <div className={` ${state.theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white"} w-[30px] h-[30px] rounded-full flex items-center justify-center border-gray-700`}>
                        <MdChevronLeft size={20} />
                    </div>
                </div>
                <div className={`${state.theme === "light" ? "bg-stone-50 text-black" : "bg-gray-700 text-white"}  p-3 rounded-l-lg md:w-[240px]`}>
                    {/* <ProfileCard/> */}
                </div>
                <ul className="">
                    <Link to="/user/dashboard"><li className={` ${state.theme === "light" ? "bg-black text-white " : "bg-white text-black"} flex items-center gap-3 mb-3 py-4 px-2 rounded-l-lg`}>
                        <BiHome />Home</li></Link>
                    <Link to="/user/add_post">
                        <li className="flex items-center gap-3 mb-3"><MdOutlinePostAdd />Add New File</li>
                    </Link>
                    <Link to="/user/my_file">
                        <li className="flex items-center gap-3 mb-3"> <BiFile />My Files</li>
                    </Link>
                    <Link to="/user/my_profile">
                        <li className="flex items-center gap-3 mb-3"> <MdOutlineShoppingBag />My Profile
                            <span className=" bg-purple-500 w-[5px] h-[5px] rounded-full "></span>
                        </li>
                    </Link>
                </ul>
                <hr className="my-4 border-gray-300" />
                <p>Account</p>
                <ul className="min-h-screen pointer">
                    <li className="flex items-center gap-3 mb-3 pointer" onClick={Logout}><MdOutlineLogout />Logout</li>
                </ul>
            </section>
            {/* <Footer /> */}
        </>
    )
}