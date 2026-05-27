"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [metals, setMetals] = useState([]);

  useEffect(() => {
    fetch("/api/properties", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setProperties(data.properties || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/api/metals", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setMetals(data.metals || []))
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this asset?")) return;

    const res = await fetch("/api/metals", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setMetals((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">

      {/* ✅ MOBILE TOPBAR */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-white/10 bg-black/40 backdrop-blur">
        <h1 className="text-lg font-semibold">AssetX</h1>
        <button
          onClick={() => router.push("/dashboard/submit")}
          className="bg-blue-600 px-3 py-1.5 rounded text-sm"
        >
          + Add
        </button>
      </div>

      <div className="flex">

        {/* ✅ DESKTOP SIDEBAR */}
        <div className="hidden md:flex w-64 bg-white/5 border-r border-white/10 p-6 flex-col">
          <h1 className="text-2xl mb-8 text-blue-400">AssetX</h1>

          <nav className="space-y-4 text-sm">
            <div className="text-blue-400">Dashboard</div>
            <div className="text-gray-400 hover:text-white cursor-pointer">Properties</div>
            <div className="text-gray-400 hover:text-white cursor-pointer">Loans</div>
            <div className="text-gray-400 hover:text-white cursor-pointer">Settings</div>
          </nav>

          <button
            onClick={async () => {
              await fetch("/api/logout", { method: "POST" });
              router.push("/");
            }}
            className="mt-auto bg-red-500/20 p-2 rounded text-sm"
          >
            Logout
          </button>
        </div>

        {/* ✅ MAIN CONTENT */}
        <div className="flex-1 p-4 md:p-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-semibold">Dashboard</h2>

            <button
              onClick={() => router.push("/dashboard/submit")}
              className="hidden md:block bg-blue-600 px-4 py-2 rounded text-sm"
            >
              + Submit Asset
            </button>
          </div>

          {/* Total Value */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 mb-6">
            <p className="text-gray-400 text-sm">Total Asset Value</p>
            <h3 className="text-xl md:text-2xl mt-2">
              ₹
              {metals
                .reduce((sum, m) => sum + Number(m.price || 0), 0)
                .toLocaleString()}
            </h3>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
            <div className="bg-white/5 p-4 rounded-xl">
              <p className="text-gray-400 text-sm">Properties</p>
              <h3 className="text-xl">{properties.length}</h3>
            </div>

            <div className="bg-white/5 p-4 rounded-xl">
              <p className="text-gray-400 text-sm">Loans</p>
              <h3 className="text-xl">0</h3>
            </div>

            <div className="bg-white/5 p-4 rounded-xl">
              <p className="text-gray-400 text-sm">Wallet</p>
              <h3 className="text-xl">$0</h3>
            </div>
          </div>

          {/* PROPERTIES */}
          <div className="mb-8">
            <h3 className="mb-4 text-lg">Your Properties</h3>

            {properties.length === 0 ? (
              <div className="bg-white/5 p-4 rounded text-sm text-gray-400">
                No properties yet.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {properties.map((p) => (
                  <div key={p.id} className="bg-white/5 p-4 rounded-xl">
                    <h4 className="font-semibold">{p.title}</h4>
                    <p className="text-sm text-gray-400">{p.location}</p>

                    <div className="mt-3 flex justify-between items-center">
                      <p>₹{Number(p.price).toLocaleString()}</p>

                      <button
                        onClick={() =>
                          router.push(`/dashboard/assets/${p.id}?type=property`)
                        }
                        className="text-blue-400 text-sm"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* METALS */}
          <div>
            <h3 className="mb-4 text-lg">Your Metals</h3>

            {metals.length === 0 ? (
              <div className="bg-white/5 p-4 rounded text-sm text-gray-400">
                No metals yet.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {metals.map((m) => (
                  <div key={m.id} className="bg-white/5 p-4 rounded-xl">
                    <h4 className="font-semibold">{m.title}</h4>

                    <p className="text-sm text-gray-400">
                      {m.type} • {m.purity}
                    </p>

                    <div className="mt-3 flex justify-between items-center">
                      <p>₹{Number(m.price).toLocaleString()}</p>

                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/assets/${m.id}?type=metal`)
                          }
                          className="text-blue-400 text-sm"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleDelete(m.id)}
                          className="text-red-400 text-sm"
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