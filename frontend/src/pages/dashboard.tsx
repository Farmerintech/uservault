import { useContext, useEffect, useState } from "react"

import { useNavigate } from "react-router"
import axios from "axios"
// import { Users } from "../components/user"
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../context/provider";
import { DashMenu } from "../components/dash-menu";
import { Main } from "../components/main";
import { Footer } from "../components/footer";
export const Dashboard = () => {

    useEffect(() => {
        const token = state.user.token
        if (!token || token === '') {
            navigate('/signin')
            return
        }
        try {
            const decode = jwtDecode(token)
            console.log(decode)
            const currentTime = Date.now() / 1000
            if (decode?.exp || 0 < currentTime) {
                navigate('/login')
            }
        } catch (error) {
            console.log(error)
        }
    }, [])
    const [data, setData] = useState()
    const [msg, setMsg] = useState()
    const { state } = useContext(UserContext)

    const navigate = useNavigate()
    const headers = {
        "Content-type": "application/json",
        "Authorization": `Bearer ${state.user.token}`
    }

    useEffect(() => {

    })
    useEffect(() => {
        axios.get(`/api/v1/profile/${state.user.username}`, { headers })
            .then(response => {
                setData(response.data.user)
                // console.log(data)
            })
            .catch(error => {
                setMsg(error.response.data.message)
                console.log(error)
            })

    }, [data]);


    return (
        <>
        <p>{msg && msg}</p>
            <section className={` ${state.theme === "light" ? "bg-stone-50 text-black" : "bg-gray-700 text-white"} h-[full] hidden md:flex justify-between min-h-screen`}>
                <DashMenu />
                <Main />
                {/* <Chat/> */}
            </section>
            <section className={` ${state.theme === "light" ? "bg-stone-50 text-black" : "bg-gray-700 text-white"} h-[full]  md:hidden justify-between min-h-screen`}>
                <Main />
                <Footer />
            </section>
        </>
    )
}