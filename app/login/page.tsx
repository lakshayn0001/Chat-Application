"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import './page.css'
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from 'next/link'


const Login =()=>{
    const router = useRouter()
    const [formData,setFormData]= useState({
        indetifier:"",
        password:""
    })
    const handleData=(e:ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=e.target
        setFormData((prev)=>({...prev,[name]:value}))
    }

    const handleSubmit =async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        console.log(formData.indetifier.trim())
        try{
            const result = await signIn("credentials",{
                email:formData.indetifier.trim(),
                password:formData.password.trim(),
                redirect:false
            })
            if(result?.error){
                alert("invalid email and password")
                return
            }
            router.push('/')

        }catch(err){
            console.log("error",err)
        }

        setFormData({
            indetifier:"",
            password:""
        })
    }
    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label>UserName or Email</label>
                <input 
                placeholder="Enter the value"
                name="indetifier"
                value={formData.indetifier}
                onChange={handleData}
                />
                <label>Password</label>
                <input 
                placeholder="Enter the value"
                name="password"
                value={formData.password}
                onChange={handleData}
                />
                <button type="submit">Login</button>

                <p style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#a1a1aa" }}>
                    Don't have account ?(" ") <Link 
                    href="/sign-up"
                    style={{ color: "#a855f7", fontWeight: "600", textDecoration: "none" }}
                    >Sign-up</Link></p>
            </form>
        </div>
    )
}


export default Login