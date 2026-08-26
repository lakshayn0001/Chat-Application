import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";


const {auth} = NextAuth(authConfig)

export default auth((req)=>{
    const isLoggedIn= !!req.auth
    const {pathname} = req.nextUrl

    const isAuthPage = pathname.startsWith('/login')
    || pathname.startsWith('/sign-up')
    console.log("islogin",isLoggedIn)

    const isProtectedPage= pathname === "/" || pathname.startsWith('/profile')
    
    if(isLoggedIn && isAuthPage){
        return NextResponse.redirect( new URL('/',req.url))
    }

    if(!isLoggedIn && isProtectedPage){
        return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()

})


export const config={
    matcher:['/((?!api|_next/static|_next/image|favicon.ico).*)']
}