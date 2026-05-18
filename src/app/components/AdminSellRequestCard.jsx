export default function AdminSellRequestCard({ item }) {
  const firstImage = item.images?.[0]?.url;

  return (
    <a
      href={`/admin/sell-requests/${item._id}`}
      className="block rounded-3xl border border-black/10 bg-white p-5 shadow-sm hover:border-[#FFA500]"
    >
      <div className="flex gap-4">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#FFC107]/20">
          {firstImage ? (
            <img
              src={firstImage}
              alt={item.gadgetName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-black/40">
              No Image
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-black">
                  {item.gadgetName}
                </h3>

                <p className="mt-1 text-sm text-black/60">
                  Seller: {item.sellerName} · {item.sellerPhone}
                </p>
              </div>

              <span className="rounded-full bg-[#FFC107] px-3 py-1 text-xs font-black text-black">
                {item.status}
              </span>
            </div>

            <p className="mt-2 line-clamp-2 text-sm text-black/60">
              {item.gadgetDescription}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="font-black text-black">
              Asking: ₦{Number(item.sellerAskingPrice).toLocaleString()}
            </p>

            <p className="text-sm font-bold text-black/50">
              Trials: {item.negotiationCount}/3
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}