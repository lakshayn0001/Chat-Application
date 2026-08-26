import type { NextAuthConfig } from "next-auth";

export const authConfig ={
    session:{
        strategy:'jwt',
        maxAge: 24*60*60
    },
    pages:{
        signIn:'/login'
    },
    callbacks:{
        async jwt({token,user}){
            if(user){
                token.id = user.id
            }
            return token
        },
        async session({session,token}){
            if(session.user && token.id){
                session.user.id = token.id as string
            }
            return session
        },
    },
    providers:[]
}satisfies NextAuthConfig;