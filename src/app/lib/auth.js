import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const {
 handlers,
 signIn,
 signOut,
 auth
} = NextAuth({
 providers:[
  Google({
   clientId:process.env.GOOGLE_CLIENT_ID,
   clientSecret:process.env.GOOGLE_CLIENT_SECRET
  })
 ],

 pages:{
  signIn:"/signup"
 },

 callbacks:{
  async session({session,token}){

   if(session.user){
      session.user.id=token.sub
   }

   return session
  }
 },

 session:{
   strategy:"jwt"
 },

 secret:process.env.NEXTAUTH_SECRET
})