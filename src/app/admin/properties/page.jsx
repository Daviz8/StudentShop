"use client";

import { useEffect, useState } from "react";
import { Loader2,PackagePlus, Trash2,RefreshCw, Eye,EyeOff,} from "lucide-react";

const initialForm = {
  name: "",
  description: "",
  category: "Gadget",
  condition: "verified",
  price: "",
  stock: "",
  isActive: true,
};

export default function AdminPropertiesPage() {
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const loadProperties = async () => {
    try {
      setLoadingProperties(true);

      const res = await fetch("/api/admin/properties", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to fetch Properties");
        return;
      }

      setProperties(data.properties || []);
    } catch (error) {
      alert("Failed to load Properties");
    } finally {
      setLoadingProperties(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

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
    setPreviews(validFiles.map((file) => URL.createObjectURL(file)));
  };

  const uploadProperty = async (event) => {
    event.preventDefault();

    if (!form.name || !form.description || !form.price || !form.stock) {
      alert("Name, description, price and stock are required.");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one property image.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await fetch("/api/admin/properties", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Property upload failed");
        return;
      }

      alert("Property uploaded successfully.");

      previews.forEach((url) => URL.revokeObjectURL(url));

      setForm(initialForm);
      setImages([]);
      setPreviews([]);

      await loadProperties();
    } catch (error) {
      alert("Something went wrong while uploading property.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleProperty = async (property) => {
    try {
      const res = await fetch(`/api/admin/properties/${property._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !property.isActive,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to update property");
        return;
      }

      await loadProperties();
    } catch (error) {
      alert("Failed to update property");
    }
  };

  const deleteProperty = async (propertyId) => {
    const confirmed = confirm("Delete this property permanently?");

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to delete property");
        return;
      }

      await loadProperties();
    } catch (error) {
      alert("Failed to delete property");
    }
  };

  return (
    <main className="min-h-screen bg-[#FFC107]/10 px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] bg-black p-8 text-white">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FFC107]">
            Admin Dashboard
          </p>

          <h1 className="mt-3 text-4xl font-black">Manage Properties</h1>

          <p className="mt-3 max-w-2xl text-white/60">
            Upload Properties, manage stock, hide Properties, and delete Properties
            from the database.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <form
            onSubmit={uploadProperty}
            className="rounded-[2rem] bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex items-center gap-2">
              <PackagePlus size={22} />
              <h2 className="text-2xl font-black text-black">
                Upload property
              </h2>
            </div>

            <div className="grid gap-4">
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="property name"
                className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
              />

              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="property description"
                className="min-h-28 rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  placeholder="Category"
                  className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
                />

                <select
                  value={form.condition}
                  onChange={(e) => updateField("condition", e.target.value)}
                  className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
                >
                  <option value="verified">Verified</option>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="fairly_used">Fairly Used</option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="Price ₦"
                  className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
                />

                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => updateField("stock", e.target.value)}
                  placeholder="Stock"
                  className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#FFA500]"
                />
              </div>

              <label className="flex items-center gap-3 rounded-2xl bg-[#FFC107]/20 p-4 font-bold text-black">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                  className="h-5 w-5 accent-[#FFA500]"
                />
                property is active and visible
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="rounded-2xl border border-dashed border-black/20 p-4"
              />

              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {previews.map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt="Preview"
                      className="h-24 w-full rounded-2xl object-cover"
                    />
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#FFA500] px-5 py-4 font-black text-black hover:bg-[#FFC107] disabled:opacity-60"
              >
                {submitting && <Loader2 className="animate-spin" size={18} />}
                {submitting ? "Uploading..." : "Upload property"}
              </button>
            </div>
          </form>

          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-black">
                Properties in Database
              </h2>

              <button
                type="button"
                onClick={loadProperties}
                className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 font-bold text-black hover:bg-black hover:text-white"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            {loadingProperties ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin" />
              </div>
            ) : properties.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-10 text-center">
                <p className="font-bold text-black/50">No Properties yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => {
                  const image =
                    property.images?.[0]?.url ||
                    property.images?.[0] ||
                    "/placeholder.png";

                  return (
                    <div
                      key={property._id}
                      className="grid gap-4 rounded-3xl border border-black/10 p-4 md:grid-cols-[90px_1fr_auto]"
                    >
                      <img
                        src={image}
                        alt={property.name}
                        className="h-24 w-24 rounded-2xl object-cover"
                      />

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-black px-3 py-1 text-xs font-black uppercase text-white">
                            {property.category}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                              property.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {property.isActive ? "Active" : "Hidden"}
                          </span>
                        </div>

                        <h3 className="mt-2 text-xl font-black text-black">
                          {property.name}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-sm text-black/50">
                          {property.description}
                        </p>

                        <p className="mt-2 font-black text-black">
                          ₦{Number(property.price).toLocaleString()} · Stock:{" "}
                          {property.stock}
                        </p>
                      </div>

                      <div className="flex gap-2 md:flex-col">
                        <button
                          type="button"
                          onClick={() => toggleProperty(property)}
                          className="flex items-center justify-center gap-2 rounded-2xl border border-black/10 px-4 py-3 text-sm font-black text-black hover:bg-black hover:text-white"
                        >
                          {property.isActive ? (
                            <>
                              <EyeOff size={16} />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye size={16} />
                              Show
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteProperty(property._id)}
                          className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white hover:bg-red-700"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
