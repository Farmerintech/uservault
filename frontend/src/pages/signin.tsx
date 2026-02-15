import { useContext, useState } from "react"
import image from "../assets/Exams-cuate.png"
import axios from "axios"

import {FaEye, FaEyeSlash} from "react-icons/fa"
import { Link, useNavigate } from "react-router"
import { UserContext } from "../context/provider"
export const Login = () => {

    const [form, setForm] = useState(
        {
            username:'',
            password:""
        }
    )
    const [msg, setMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [show, setShow] = useState(false)
    const navigate = useNavigate()
    const showPassword = ()=>{
      setShow(!show)
    }
    const handleForm = (event:any) =>{
        setForm({
            ...form,
            [event.target.name]:event.target.value
        })
    }
    const { dispatch} = useContext(UserContext)
    const handleSubmit = (event:any) => {
      setIsLoading(true)
        event.preventDefault()
        if(form.username === ''){
            setMsg("Username is reqired to login")
            setIsLoading(false)
            return
        }
        if(form.password === ''){
            setMsg("Password is reqired to login")
            setIsLoading(false)
            return
        }
        if(form.password.length < 8){
            setMsg("Password must be at least 8 characters")
            setIsLoading(false)
            return
        }
        const headers = {
            "Content-type":"application/json",
        }
    axios.post('/api/v1/auth/login', form, {headers})
           .then(response =>{
            setMsg(response.data.message)
            setForm({
                username:'',
                password:''
            })
            dispatch({type:"Login", payload:response.data.user})
            navigate('/')
            console.log(localStorage.getItem('user'))
            setIsLoading(false)
           })
        .catch (error => {
            setMsg(error.response.data.message)
            setIsLoading(false)
            console.log(error)
        })
    }
    return(
        <div className="w-full mt-10 flex flex-wrap items-center justify-center content-center ">
        <div className=" md:w-[30%] w-[80%] mt-10 flex justify-center">
            <img src={image} alt="login-page" className="w-[full] h-[300px] "/>
        </div>
        <form className="rounded px-10 pt-6 pb-8 mb-4 " onSubmit={handleSubmit}>
            <div className="mt-10 mb-10 ">
                <h3 className="font-bold text-3xl">Welcome!</h3>
                <p className="text-lg">Enter Details to Login</p>
            </div>
            {isLoading &&
            <div className="w-[30px] h-[30px] flex justify-center item-center">
          <p className="text-purple-500 font-bold">Loading...</p>
        </div>}
            <p className="text-red-500 text-sm">{msg}</p>
          <div className="mb-4 w-full">
            <label className="block  text-sm font-bold mb-2">
              Username
            </label>
            <input 
            name="username"
            value={form.username}
            onChange={handleForm}
            className="shadow appearance-none border rounded w-full py-2 px-10 
             leading-tight focus:outline-none focus:shadow-outline" 
            id="username" type="text" placeholder="Username"/>
          </div>
          <div className="mb-6 relative w-full">
            <label className="block  text-sm font-bold mb-2">
              Password
            </label>
            <p className="absolute top-10 right-3" onClick={showPassword}>{show ? <FaEye/>: <FaEyeSlash/>}</p>
            <input 
              name="password"
              value={form.password}
              onChange={handleForm}
            className="shadow appearance-none border
            rounded w-full py-2 px-10  mb-3 leading-tight 
            focus:outline-none focus:shadow-outline" id="password" 
            type= {show ? "text" : "password"}
            placeholder="******************"/>
          </div>
          <div className="flex flex-col-reverse justify-between">
            <button className="bg-purple-500 hover:bg-purple-700 
            text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
            type="submit">
              Sign In
            </button>
            <p className="inline-block align-baseline font-bold text-sm text-purple-500 hover:text-purple-800 flex justify-between">
            <Link to="/login" className="font-bold text-sm text-purple-500 hover:text-purple-800">Forget Password?</Link>
            </p>
          </div>
          <p className="inline-block align-baseline font-bold text-sm text-purple-500 hover:text-purple-800 flex justify-between">
            <Link to="/register" className="font-bold text-sm text-purple-500 hover:text-purple-800">Have No Account Yet..? Sign Up</Link>
            </p>
        </form>
      </div>      
    )
}