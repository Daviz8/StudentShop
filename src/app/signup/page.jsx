"use client";

import { useSession,signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

export default function SignUpPage(){

const router=useRouter()

const {
 data:session,
 status
}=useSession()


useEffect(()=>{

 if(status==="authenticated"){
     router.push("/store")
 }

},[status,router])


if(status==="loading"){

return(

<div className="flex min-h-screen items-center justify-center">

Loading...

</div>

)

}


return(

<main className="min-h-screen bg-gradient-to-br from-[#FFA500] to-[#FFC107]">
<div className="mx-auto flex min-h-screen p-10 max-w-md items-center">
<div className="w-full rounded-[30px] bg-white p-8 shadow-xl">
<div className="mb-6 flex justify-center">
<div className="rounded-3xl bg-black p-5 text-[#FFC107]">
<ShoppingBag size={32}/>

</div>

</div>

<h1 className="text-center text-3xl font-black">

Create Account

</h1>

<p className="mt-3 text-center text-black/50">

Continue with Google

</p>


<button
onClick={()=>signIn(
"google",
{
 callbackUrl:"/store"
}
)}
className="mt-8 w-full rounded-2xl bg-[#FFA500] px-6 py-4 font-black hover:bg-[#FFC107]"
>

Continue With Google

</button>

</div>

</div>

</main>

)

}