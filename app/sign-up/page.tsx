"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import './page.css'
import { useRouter } from "next/navigation"
import Link from "next/link"

const sign_up =()=>{
    const router = useRouter()
    const [value,setValue]=useState({
        username:"",
        email:"",
        password:""
    })

    const handleSubmit=(e:ChangeEvent<HTMLInputElement>)=>{
        e.preventDefault()
        const {name,value}=e.target
        setValue((prev)=>({...prev,[name]:value}))
    }

    function hasEmptyField(){
        const check = Object.values(value).some((value)=>!(value.trim().length > 0))

        if(value.password.length < 6){
            alert("Password Must be have at Least 6 Digit")
            throw new Error("Password Must be have at Least 6 Digit")
        }
        return check
    }
    const handleform=async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        
        if (hasEmptyField() == false){
            try{
                const res= await fetch("/api/auth/register",
                    {method:"POST",
                        headers:{"Content-Type":"application/json"},
                        body:JSON.stringify({
                            username:value.username,
                            email:value.email,
                            password:value.password
                        })})

                console.log(res)
                const data= await res.json()

                console.log("data",data)
                if (res.status != 200){
                    alert("Failed to Login")
                    alert(data.error)
                    return
                }
                alert(data.message)
                router.push("/login")
            }catch(err: any){
                console.log(err)
            }

            console.log("Submit",value)
        setValue({
            username:"",
            email:"",
            password:""
        })
        return
        }
        alert("error")
        return
        
    }

    return(
        <div>
            <form  onSubmit={handleform}>
                <label>UserName</label>
                <input 
                placeholder="UserName"
                name="username"
                value={value.username}
                onChange={handleSubmit}
                />
                <label>Email</label>
                <input 
                placeholder="Email"
                name="email"
                value={value.email}
                onChange={handleSubmit}
                />
                <label>Password</label>
                <input 
                placeholder="Password"
                name="password"
                value={value.password}
                onChange={handleSubmit}
                />
                <button type="submit">Submit</button>
                <p style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#a1a1aa" }}>
                    Already have an account?{" "}
                    <Link href="/login" style={{ color: "#a855f7", fontWeight: "600", textDecoration: "none" }}>
                        Login
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default sign_up