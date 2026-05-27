"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [assets, setAssets] = useState([]);
  const [metals, setMetals] = useState([]);

  useEffect(() => {
    fetch("/api/properties", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch properties");
        return res.json();
      })
      .then((data) => setProperties(data.properties || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/api/metals", { credentials: "include" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch metals");
        return data;
      })
      .then((data) => setMetals(data.metals || []))
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;

    try {
      const res = await fetch("/api/metals", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Failed to delete");

      setMetals((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">

      {/* ✅ MOBILE HEADER (same design language) */}
      <div className="md:hidden flex justify-between items-center px-4 py-3 border-b border-white/10 bg-white/5">
        <h1 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          AssetX
        </h1>

        <button
          onClick={() => router.push("/dashboard/submit")}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm"
        >
          + Submit
        </button>
      </div>

      <div className="flex">

        {/* ✅ SIDEBAR (unchanged, just hidden on mobile) */}
        <div className="hidden md:flex w-64 bg-white/5 border-r border-white/10 p-6 flex-col">
          <h1 className="text-2xl font-semibold tracking-tight mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            AssetX
          </h1>

          <nav className="space-y-4 text-sm">
            <div className="text-blue-400">Dashboard</div>
            <div className="text-gray-400 hover:text-white cursor-pointer">Properties</div>
            <div className="text-gray-400 hover:text-white cursor-pointer">Loans</div>
            <div className="text-gray-400 hover:text-white cursor-pointer">Settings</div>
          </nav>

          <div className="mt-auto">
            <button
              onClick={async () => {
                await fetch("/api/logout", { method: "POST" });
                router.push("/");
              }}
              className="w-full mt-6 bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* MAIN */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 relative overflow-hidden">

          {/* Background glow (scaled for mobile) */}
          <div className="absolute w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-blue-600/20 blur-[120px] rounded-full top-[-80px] left-[20px] md:left-[200px]" />
          <div className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-purple-600/20 blur-[120px] rounded-full bottom-[-80px] right-[10px] md:right-[100px]" />

          {/* Header */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-semibold">Dashboard</h2>

            <button
              onClick={() => router.push("/dashboard/submit")}
              className="hidden sm:block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
            >
              + Submit Asset
            </button>
          </div>

          {/* Total Value */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 mb-6">
            <p className="text-gray-400 text-sm">Total Asset Value</p>
            <h3 className="text-xl md:text-2xl mt-2">
              ₹{metals.reduce((sum, m) => sum + Number(m.price || 0), 0).toLocaleString()}
            </h3>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6">
              <p className="text-gray-400 text-sm">Total Properties</p>
              <h3 className="text-xl md:text-2xl mt-2">{properties.length}</h3>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6">
              <p className="text-gray-400 text-sm">Active Loans</p>
              <h3 className="text-xl md:text-2xl mt-2">0</h3>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6">
              <p className="text-gray-400 text-sm">Wallet Balance</p>
              <h3 className="text-xl md:text-2xl mt-2">$0</h3>
            </div>
          </div>

          {/* Properties */}
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-4">Your Properties</h3>

            {properties.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 text-gray-400 text-sm">
                No properties yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {properties.map((p) => (
                  <div key={p.id} className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-5 hover:bg-white/10 transition">
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <h4 className="text-base md:text-lg font-semibold">{p.title}</h4>

                      <span className={`text-xs px-2 py-1 rounded-full ${
                        p.status === "approved"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {p.status || "pending"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 mb-3">📍 {p.location}</p>

                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                      {p.property_type || "Unknown type"}
                    </p>

                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-lg md:text-xl font-semibold">
                        ₹{Number(p.price).toLocaleString()}
                      </p>

                      <button
                        onClick={() =>
                          router.push(`/dashboard/assets/${p.id}?type=property`)
                        }
                        className="text-sm text-blue-400 hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Metals */}
          <div className="relative z-10 mt-8">
            <h3 className="text-lg font-medium mb-4">Your Metals</h3>

            {metals.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 text-gray-400 text-sm">
                No metals yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {metals.map((m) => (
                  <div key={m.id} className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-xl p-4 md:p-5 hover:scale-[1.02] transition">
                    <div className="flex justify-between items-start mb-3 gap-2 flex-wrap">
                      <h4 className="text-base md:text-lg font-semibold">{m.title}</h4>

                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 capitalize">
                          {m.type}
                        </span>

                        <span className={`text-xs px-2 py-1 rounded-full ${
                          m.status === "tokenized"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {m.status || "pending"}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 mb-2">Form: {m.asset_form || "N/A"}</p>
                    <p className="text-sm text-gray-400 mb-2">Purity: {m.purity}</p>
                    <p className="text-sm text-gray-400 mb-2">
                      Units: {Math.floor(Number(m.price) / 100)}
                    </p>

                    <div className="mt-4 flex justify-between items-end">
                      <div>
                        <p className="text-xs text-gray-500">Valuation</p>
                        <p className="text-lg md:text-xl font-semibold">
                          ₹{Number(m.price).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/assets/${m.id}?type=metal`)
                          }
                          className="text-sm text-blue-400 hover:underline"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="text-xs text-gray-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}