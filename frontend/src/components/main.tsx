import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/provider"
import axios from "axios"
import FileManager from "./createFile"


export const Main = () =>{
    const [data, setData] = useState()
    const [msg, setMsg] = useState()
    const {state} = useContext(UserContext)
    const headers = {
        "Content-type":"application/json",
        "Authorization":`Bearer ${state.user.token}`
    }
    
    useEffect(()=>{
        axios.get(`/api/v1/profile/${state.user.username}`, {headers})
        .then((response:any) =>{
            setData(response.data.user)
            // console.log(data.followers.length)
        })
     .catch ((error:any) => {
         setMsg(error.response.data.message)
         console.log(error)
     })
    
    }, [data]);
   

    return (
        <main className="flex flex-col gap-5 lg:w-[50%] md:w-[40%] p-5 md:pt-5 relative lg:left-[22%] md:left-[32%]">
            <p>{msg && msg}</p>
            <FileManager/>
        </main>
    )
}