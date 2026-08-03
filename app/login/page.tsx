"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import './page.css'

const Login =()=>{
    const [formData,setFormData]= useState({
        indetifier:"",
        password:""
    })
    const handleData=(e:ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=e.target
        setFormData((prev)=>({...prev,[name]:value}))
        console.log("insider",value)
    }

    const handleSubmit =(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        console.log(formData)
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
            </form>
        </div>
    )
}


export default Login