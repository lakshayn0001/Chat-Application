"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import './page.css'

const sign_up =()=>{
    const [value,setValue]=useState({
        username:"",
        email:"",
        password:""
    })

    const handleSubmit=(e:ChangeEvent<HTMLInputElement>)=>{
        e.preventDefault()
        const {name,value}=e.target
        console.log("target",e.target)
        setValue((prev)=>({...prev,[name]:value}))
    }

    function checker(){
        const emptyCheck= Object.entries(value).find((key,value)=>(value))
        console.log(emptyCheck)
        return false
    }
    const handleform=(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        if (checker() == false){
            alert("error")
            return 
        }
        console.log("Submit",value)
        setValue({
            username:"",
            email:"",
            password:""
        })
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
            </form>
        </div>
    )
}

export default sign_up