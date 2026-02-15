import { MdDashboard,  MdHome,  MdMessage, MdSettings } from "react-icons/md"
import {Link} from "react-router"
import { useContext } from "react"
import { UserContext } from "../context/provider"
export const Footer = ()=>{
    const {state} = useContext(UserContext)
    return(
        <section className={`${state.theme === "light" ? "bg-white text-black" :"bg-gray-800 text-white"} p-5 w-[100%] md:hidden flex items-center 
        justify-between fixed bottom-0  shadow-md`}>
            <Link to="/" className="flex flex-col items-center hover:text-purple-800">
                <MdHome size={25}/>
                <p>Home</p>
            </Link>
            <Link to="/dashboard" className="flex flex-col items-center hover:text-purple-800">
                <MdDashboard size={25}/>
                <p>Dashboad</p>
            </Link>
            <Link to="/chat" className="flex flex-col items-center hover:text-purple-800">
                <MdMessage size={25}/>
                <p>Message</p>
            </Link>
            <Link to="" className="flex flex-col items-center hover:text-purple-800">
                <MdSettings size={25}/>
                <p>Settings</p>
            </Link>
        </section>
    )
}