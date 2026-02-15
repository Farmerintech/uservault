import { useState } from "react"
import image from "../assets/icon.png"
import axios from "axios"
// import video from "../assets/loading-unscreen.gif"
import { Link, useNavigate } from "react-router"
import {FaEye, FaEyeSlash} from "react-icons/fa"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
export const SignUp = () => {

    const [form, setForm] = useState(
        {
            username:'',
            email:"",
            password:"",
            secondPassword:""
        }
    )
    const [msg, setMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [show, setShow] = useState(false)
    const showPassword = ()=>{
      setShow(!show)
    }

    const handleForm = (event:any) =>{
        setForm({
            ...form,
            [event.target.name]:event.target.value
        })
    }

    const navigate = useNavigate()

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
        if(form.password !== form.secondPassword){
            setMsg("Passwords did not match")
            setIsLoading(false)
            return
        }
        const headers = {
            "Content-type":"application/json",
        }
        const body = {username:form.username, email:form.email, password:form.password}
    axios.post('/api/v1/auth/register', body, {headers})
           .then((response:any)=>{
            setMsg(response.data.message)
            setForm({
                username:'',
                email:"",
                password:'',
                secondPassword:''
            })
            setIsLoading(false)
            navigate('/login')
           })
        .catch ((error:any) => {
            setMsg(error.response.data.message)
            setIsLoading(false)
            console.log(error)
        })
    }

    return(
        <div className="w-[full] mt-10 flex flex-wrap items-center justify-center content-center ">
        <div className=" md:w-[30%] w-[80%] mt-10 flex justify-center">
            <img src={image} alt="login-page" className="w-[full] h-[300px] "/>
        </div>
        <form className="rounded px-10 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className="mt-10 mb-10 ">
                              <h2 className="font-bold text-2xl">User<span className="text-[#46B35C] text-3xl">Vault</span></h2>
                {/* <h3 className="font-bold text-3xl">Welcome!</h3> */}
                <p className="text-lg">Welcome, let get you started with few details</p>
            </div>
            {isLoading &&
            <div className="flex justify-center item-center">
          <p className="text-purple-500 font-bold">Loading...</p>
          </div>}
            <p className="text-red-500 text-sm">{msg}</p>
            <div className="flex md:gap-6 flex-wrap">
            <div className="relative mb-6 w-full md:w-auto">
            <Label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </Label>
            <input 
            name="username"
            value={form.username}
            onChange={handleForm}
            className="shadow appearance-none border-1 hover:border-2 rounded-lg py-2 px-10 w-full
             focus:outline-none focus:border-[#46B35C] border-[#46B35C]" 
            id="username" type="text" placeholder="Username"/>
          </div>
          <div className="relative mb-6 w-full md:w-auto">
            <Label className="block text-sm font-bold mb-2">
              Email
            </Label>
            <input 
            name="email"
            value={form.email}
            onChange={handleForm}
             className="shadow appearance-none border-1 hover:border-2 rounded-lg py-2 px-10 w-full
             focus:outline-none focus:border-[#46B35C] border-[#46B35C]"
            id="email" type="text" placeholder="Email"/>
          </div>
          </div>
          <div className="flex md:gap-6 flex-wrap">
          <div className="relative mb-6 w-full md:w-auto">
            <Label className="block text-sm font-bold mb-2">
              Password
            </Label>
            <p className="absolute top-10 right-3" onClick={showPassword}>{show ? <FaEye/>: <FaEyeSlash/>}</p>
            <input 
              name="password"
              value={form.password}
              onChange={handleForm}
             className="shadow appearance-none border-1 hover:border-2 rounded-lg py-2 px-10 w-full
             focus:outline-none focus:border-[#46B35C] border-[#46B35C]" id="password" 
            type= {show ? "text" : "password"}
            placeholder="******************"/>
          </div>
          <div className="mb-6 relative w-full md:w-auto">
            <Label className="block text-sm font-bold mb-2">
             Confirm Password
            </Label>
            <p className="absolute top-10 right-3" onClick={showPassword}>{show ? <FaEye/>: <FaEyeSlash/>}</p>
            <input 
              name="secondPassword"
              value={form.secondPassword}
              onChange={handleForm}
             className="shadow appearance-none border-1 hover:border-2 rounded-lg py-2 px-10 w-full
             focus:outline-none focus:border-[#46B35C] border-[#46B35C]" id="secondPassword" 
            type= {show ? "text" : "password"}
            placeholder="******************"/>
          </div>
          </div>
          <div className="flex flex-col-reverse justify-between mt-5">
            <button className="hover:bg-[#46B35C]  border-2 border-[#46B35C]
            hover:text-white font-bold py-2 px-10 md:px-4 rounded-lg focus:outline-none focus:shadow-outline" 
            type="submit">
              Sign Up
            </button>
          </div>
          <p className="inline-block align-baseline font-bold text-sm text-[#46B35C] hover:text-purple-800">
              Already have an account..? <Link to="/login" className="font-bold text-sm text-purple-500 hover:text-purple-800">Login</Link>
            </p>
        </form>
      </div>      
    )
}