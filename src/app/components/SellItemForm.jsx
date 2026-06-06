"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

const initialState = {
  sellerName: "",
  sellerPhone: "",
  sellerEmail: "",
  cityArea: "",
  idType: "",
  ninNumber: "",

  gadgetName: "",
  brandModel: "",
  colorVariant: "",
  serialOrImei: "",
  category: "electronics_gadget",
  otherCategory: "",
  condition: "good",
  sellerAskingPrice: "",
  faultsAccessoriesReason: "",
  additionalNotes: "",

  returnPreference: "cash_payout",
  desiredItem: "",
  topUpAmount: "",

  heardFrom: "instagram",
  referralCode: "",
  referredBy: "",

  agreedToTerms: false,
};

export default function SellItemForm() {
  const router = useRouter();

  const [form, setForm] = useState(initialState);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length > 5) {
      alert("You can upload a maximum of 5 images");
      event.target.value = "";
      return;
    }

    const validFiles = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed");
        event.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Each image must not be larger than 5MB");
        event.target.value = "";
        return;
      }

      validFiles.push(file);
    }

    previews.forEach((url) => URL.revokeObjectURL(url));

    setImages(validFiles);

    const previewUrls = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const submitForm = async (event) => {
    event.preventDefault();

    if (!form.sellerName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!form.sellerPhone.trim()) {
      alert("Please enter your phone / WhatsApp number.");
      return;
    }

    if (!form.cityArea.trim()) {
      alert("Please enter your city / area.");
      return;
    }

    if (!form.idType.trim()) {
      alert("Please select your ID type.");
      return;
    }

    if (!form.gadgetName.trim()) {
      alert("Please enter the item name.");
      return;
    }

    if (!form.sellerAskingPrice || Number(form.sellerAskingPrice) <= 0) {
      alert("Please enter a valid asking price.");
      return;
    }

    if (!form.faultsAccessoriesReason.trim()) {
      alert(
        "Please describe faults, accessories included, or reason for selling."
      );
      return;
    }

    if (!form.agreedToTerms) {
      alert("Please agree to the trade-in terms before submitting.");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one item image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      /*
        IMPORTANT FIX:
        Your backend is still expecting "gadgetDescription".
        Your form uses "faultsAccessoriesReason".
        This sends the same description under both names.
      */
      formData.append("gadgetDescription", form.faultsAccessoriesReason);

      images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await fetch("/api/user-sales", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("SUBMISSION_ERROR:", data);
        alert(data.message || "Submission failed");
        return;
      }

      // Capture values for the success page before clearing state
      const submittedItemName = form.gadgetName;
      const generatedId = data.saleRequest._id;

      // Revoke preview URLs to prevent memory leaks
      previews.forEach((url) => URL.revokeObjectURL(url));

      // Reset application states
      setForm(initialState);
      setImages([]);
      setPreviews([]);

      // Redirect cleanly to the newly designed success page with context parameters
     router.push(
  `/sell-requests/success/${generatedId}?item=${encodeURIComponent(submittedItemName)}`
);
      router.refresh();
    } catch (error) {
      console.error("SELL_ITEM_FORM_ERROR:", error);
      alert("Something went wrong while submitting your item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitForm}
      className="mx-auto max-w-5xl rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm md:p-8"
    >
      <div className="mb-8 rounded-[1.5rem] bg-black p-6 text-white">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#FFC107]">
          We Buy · We Sell · We Swap
        </p>

        <h1 className="mt-3 text-3xl font-black md:text-4xl">
          Customer Trade-In Agreement
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
          Submit your item for review. Student Shop Nigeria will inspect the
          item, negotiate if necessary, and contact you before any final deal is
          completed.
        </p>
      </div>

      <section className="rounded-[1.5rem] border border-black/10 p-5">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA500] text-sm font-black text-black">
            1
          </span>

          <h2 className="text-xl font-black text-black">Customer Details</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={form.sellerName}
            onChange={(e) => updateField("sellerName", e.target.value)}
            placeholder="Full name *"
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
            required
          />

          <input
            value={form.sellerPhone}
            onChange={(e) => updateField("sellerPhone", e.target.value)}
            placeholder="Phone / WhatsApp *"
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
            required
          />

          <input
            value={form.sellerEmail}
            onChange={(e) => updateField("sellerEmail", e.target.value)}
            placeholder="Email address optional"
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
          />

          <input
            value={form.cityArea}
            onChange={(e) => updateField("cityArea", e.target.value)}
            placeholder="City / Area *"
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
            required
          />

          <select
            value={form.idType}
            onChange={(e) => updateField("idType", e.target.value)}
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
            required
          >
            <option value="">Select ID type *</option>
            <option value="nin">NIN</option>
            <option value="drivers_licence">Driver&apos;s Licence</option>
            <option value="student_id">Student ID</option>
            <option value="voters_card">Voter&apos;s Card</option>
            <option value="other">Other</option>
          </select>

          <input
            value={form.ninNumber}
            onChange={(e) => updateField("ninNumber", e.target.value)}
            placeholder="NIN number"
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
          />
        </div>
      </section>

      <section className="mt-5 rounded-[1.5rem] border border-black/10 p-5">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA500] text-sm font-black text-black">
            2
          </span>

          <h2 className="text-xl font-black text-black">
            Item Being Traded In
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={form.gadgetName}
            onChange={(e) => updateField("gadgetName", e.target.value)}
            placeholder="Item name *"
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
            required
          />

          <input
            value={form.brandModel}
            onChange={(e) => updateField("brandModel", e.target.value)}
            placeholder="Brand & model"
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
          />

          <input
            value={form.colorVariant}
            onChange={(e) => updateField("colorVariant", e.target.value)}
            placeholder="Colour / size / variant"
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
          />

          <input
            value={form.serialOrImei}
            onChange={(e) => updateField("serialOrImei", e.target.value)}
            placeholder="Serial no. / IMEI if applicable"
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
          />

          <select
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
            required
          >
            <option value="phone_tablet">Phone / Tablet</option>
            <option value="laptop_computer">Laptop / Computer</option>
            <option value="electronics_gadget">Electronics / Gadget</option>
            <option value="furniture_home_item">Furniture / Home Item</option>
            <option value="other">Other</option>
          </select>

          <input
            value={form.otherCategory}
            onChange={(e) => updateField("otherCategory", e.target.value)}
            placeholder="Other category if applicable"
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
          />

          <select
            value={form.condition}
            onChange={(e) => updateField("condition", e.target.value)}
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
            required
          >
            <option value="brand_new">Brand new unused</option>
            <option value="good">Good — minor wear</option>
            <option value="needs_repair">Needs repair</option>
          </select>

          <input
            type="number"
            value={form.sellerAskingPrice}
            onChange={(e) => updateField("sellerAskingPrice", e.target.value)}
            placeholder="Customer's asking price ₦ *"
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
            required
          />
        </div>

        <textarea
          value={form.faultsAccessoriesReason}
          onChange={(e) =>
            updateField("faultsAccessoriesReason", e.target.value)
          }
          placeholder="Faults / accessories included / reason for selling *"
          className="mt-4 min-h-32 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
          required
        />

        <textarea
          value={form.additionalNotes}
          onChange={(e) => updateField("additionalNotes", e.target.value)}
          placeholder="Additional notes"
          className="mt-4 min-h-24 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
        />

        <div className="mt-4 rounded-3xl border border-dashed border-black/20 bg-[#FFC107]/10 p-5">
          <label className="block cursor-pointer">
            <span className="flex items-center gap-2 text-sm font-black text-black">
              <UploadCloud size={18} />
              Upload item pictures
            </span>

            <span className="mt-1 block text-sm text-black/50">
              Maximum 5 images. JPG, PNG, or WEBP. Each image must be under 5MB.
            </span>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="mt-4 block w-full text-sm"
              required
            />
          </label>

          {previews.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
              {previews.map((src, index) => (
                <div
                  key={src}
                  className="relative h-24 overflow-hidden rounded-2xl bg-white"
                >
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-5 rounded-[1.5rem] border border-black/10 p-5">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA500] text-sm font-black text-black">
            3
          </span>

          <h2 className="text-xl font-black text-black">
            What Customer Wants In Return
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <select
            value={form.returnPreference}
            onChange={(e) => updateField("returnPreference", e.target.value)}
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
            required
          >
            <option value="cash_payout">Cash payout</option>
            <option value="swap">Swap for another item</option>
          </select>

          <input
            value={form.desiredItem}
            onChange={(e) => updateField("desiredItem", e.target.value)}
            placeholder="Desired item if swapping or upgrading"
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
          />

          <input
            type="number"
            value={form.topUpAmount}
            onChange={(e) => updateField("topUpAmount", e.target.value)}
            placeholder="Top-up amount willing to add ₦"
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500] md:col-span-2"
          />
        </div>
      </section>

      <section className="mt-5 rounded-[1.5rem] border border-black/10 p-5">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA500] text-sm font-black text-black">
            4
          </span>

          <h2 className="text-xl font-black text-black">
            How Did You Hear About Us?
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <select
            value={form.heardFrom}
            onChange={(e) => updateField("heardFrom", e.target.value)}
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
            required
          >
            <option value="instagram">Instagram</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
            <option value="twitter_x">Twitter / X</option>
            <option value="friend_family">Friend / Family</option>
            <option value="flyer_banner">Flyer / Banner</option>
            <option value="walk_in">Walk-in</option>
          </select>

          <input
            value={form.referralCode}
            onChange={(e) => updateField("referralCode", e.target.value)}
            placeholder="Referral code if any"
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
          />

          <input
            value={form.referredBy}
            onChange={(e) => updateField("referredBy", e.target.value)}
            placeholder="Referred by name / username"
            className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
          />
        </div>
      </section>

      <section className="mt-5 rounded-[1.5rem] border border-black/10 bg-[#FFC107]/10 p-5">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA500] text-sm font-black text-black">
            5
          </span>

          <h2 className="text-xl font-black text-black">
            Agreement & Confirmation
          </h2>
        </div>

        <div className="space-y-3 text-sm leading-relaxed text-black/70">
          <p>
            By submitting this form, you confirm that the item is yours, not
            stolen, borrowed, or pledged as collateral.
          </p>

          <p>
            Student Shop Nigeria may inspect the item and may offer a different
            value from your asking price. You are not obliged to accept the final
            offer.
          </p>

          <p>
            If the item condition differs from what you described, the offer may
            be revised or withdrawn.
          </p>
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl bg-white p-4">
          <input
            type="checkbox"
            checked={form.agreedToTerms}
            onChange={(e) => updateField("agreedToTerms", e.target.checked)}
            className="mt-1 h-5 w-5 accent-[#FFA500]"
            required
          />

          <span className="text-sm font-bold text-black">
            I have read and understood the terms above. I confirm the item is
            mine, and all information provided is accurate and complete.
          </span>
        </label>
      </section>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FFA500] px-5 py-4 font-black text-black hover:bg-[#FFC107] disabled:opacity-60"
      >
        <CheckCircle2 size={18} />
        {loading ? "Submitting..." : "Submit Trade-In Request"}
      </button>
      {loading && (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
    <div className="rounded-3xl bg-white p-8 shadow-2xl">
      <div className="flex flex-col items-center">
        <Loader2
          size={50}
          className="animate-spin text-[#FFA500]"
        />

        <h3 className="mt-4 text-xl font-black text-black">
          Sending your request
        </h3>

        <p className="mt-2 text-center text-sm text-black/60">
          Please wait while we upload your images and process your trade-in
          request.
        </p>
      </div>
    </div>
  </div>
)}
    </form>
  );
}