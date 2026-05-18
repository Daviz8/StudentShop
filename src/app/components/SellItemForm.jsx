"use client";

import { useState } from "react";

const initialState = {
  sellerName: "",
  sellerPhone: "",
  sellerEmail: "",
  gadgetName: "",
  gadgetDescription: "",
  sellerAskingPrice: "",
  condition: "used",
};

export default function SellItemForm() {
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
      return;
    }

    const validFiles = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Each image must not be larger than 5MB");
        return;
      }

      validFiles.push(file);
    }

    setImages(validFiles);

    const previewUrls = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const submitForm = async (event) => {
    event.preventDefault();

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("sellerName", form.sellerName);
    formData.append("sellerPhone", form.sellerPhone);
    formData.append("sellerEmail", form.sellerEmail);
    formData.append("gadgetName", form.gadgetName);
    formData.append("gadgetDescription", form.gadgetDescription);
    formData.append("sellerAskingPrice", form.sellerAskingPrice);
    formData.append("condition", form.condition);

    images.forEach((image) => {
      formData.append("images", image);
    });

    const res = await fetch("/api/user-sales", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setLoading(false);

    if (!data.success) {
      alert(data.message);
      return;
    }

    alert("Your gadget has been submitted for admin review.");

    setForm(initialState);
    setImages([]);
    setPreviews([]);
  };

  return (
    <form
      onSubmit={submitForm}
      className="mx-auto max-w-2xl rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={form.sellerName}
          onChange={(e) => updateField("sellerName", e.target.value)}
          placeholder="Your name"
          className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
          required
        />

        <input
          value={form.sellerPhone}
          onChange={(e) => updateField("sellerPhone", e.target.value)}
          placeholder="Phone number"
          className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
          required
        />

        <input
          value={form.sellerEmail}
          onChange={(e) => updateField("sellerEmail", e.target.value)}
          placeholder="Email address"
          className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
        />

        <input
          value={form.gadgetName}
          onChange={(e) => updateField("gadgetName", e.target.value)}
          placeholder="Gadget name"
          className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
          required
        />

        <input
          type="number"
          value={form.sellerAskingPrice}
          onChange={(e) => updateField("sellerAskingPrice", e.target.value)}
          placeholder="Your asking price"
          className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
          required
        />

        <select
          value={form.condition}
          onChange={(e) => updateField("condition", e.target.value)}
          className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
        >
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="faulty">Faulty</option>
        </select>
      </div>

      <textarea
        value={form.gadgetDescription}
        onChange={(e) => updateField("gadgetDescription", e.target.value)}
        placeholder="Describe the gadget, condition, faults, accessories, battery health, etc."
        className="mt-4 min-h-32 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
        required
      />

      <div className="mt-4 rounded-3xl border border-dashed border-black/20 bg-[#FFC107]/10 p-5">
        <label className="block cursor-pointer">
          <span className="block text-sm font-black text-black">
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

      <button
        disabled={loading}
        className="mt-5 w-full rounded-2xl bg-[#FFA500] px-5 py-4 font-black text-black hover:bg-[#FFC107] disabled:opacity-60"
      >
        {loading ? "Uploading..." : "Submit Gadget"}
      </button>
    </form>
  );
}