async function getProperty(id){

const baseUrl=
process.env.NEXT_PUBLIC_SITE_URL;

const res=await fetch(
`${baseUrl}/api/properties/${id}`,
{
cache:"no-store"
}
)

if(!res.ok) return null

const data=await res.json()

return data.property
}

export default async function PropertyDetails({
params
}){

const {id}=await params

const property=
await getProperty(id)

if(!property){

return(
<div className="p-10">
Property not found
</div>
)

}

return(

<main className="mx-auto max-w-6xl px-6 py-12">

<div className="grid gap-10 lg:grid-cols-2">

<div className="grid gap-4">

{property.images?.map(
(image,index)=>(

<img
key={index}
src={image}
alt=""
className="h-80 w-full rounded-3xl object-cover"
/>

))
}

</div>

<div>

<h1 className="text-4xl font-black">
{property.name}
</h1>

<p className="mt-5 text-black/60">
{property.description}
</p>

<p className="mt-8 text-3xl font-black text-[#FFA500]">
₦{property.price?.toLocaleString()}
</p>

<div className="mt-8 rounded-3xl bg-[#FFC107]/10 p-6">

<p>
Category:
<b>
{property.category}
</b>
</p>

<p className="mt-3">
available
<b>
</b>
</p>

</div>

</div>

</div>

</main>

)

}