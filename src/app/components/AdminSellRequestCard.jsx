import Link from "next/link";
import mongoose from "mongoose";

export default function AdminSellRequestCard({ item }) {
  const id = item?._id ? String(item._id) : null;

  const isValidId = id && mongoose.Types.ObjectId.isValid(id);

  console.log("CARD ID:", id, "VALID:", isValidId);

  if (!isValidId) {
    return (
      <div className="rounded-[2rem] bg-red-50 p-6 text-red-600 font-bold">
        Invalid item ID detected
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-black/10">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-black">
            {item.gadgetName}
          </h2>

          <p className="mt-2 text-black/60">{item.brandModel}</p>

          <div className="mt-4 grid gap-2 text-sm text-black/70">
            <p><strong>Seller:</strong> {item.sellerName}</p>
            <p><strong>Phone:</strong> {item.sellerPhone}</p>
            <p>
              <strong>Price:</strong> ₦{Number(item.sellerAskingPrice).toLocaleString()}
            </p>
            <p><strong>Status:</strong> {item.status}</p>
          </div>
        </div>

        <Link
          href={`/admin/sell-requests/${id}`}
          className="rounded-full bg-black px-6 py-3 font-black text-white hover:bg-[#FFA500]"
        >
          View Order
        </Link>
      </div>
    </div>
  );
}