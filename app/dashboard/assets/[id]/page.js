"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AssetDetails() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type");

  const [asset, setAsset] = useState(null);

  useEffect(() => {
    const endpoint =
      type === "property"
        ? `/api/properties/${id}`
        : `/api/metals/${id}`;

    fetch(endpoint, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setAsset(data.property || data.metal);
      });
  }, [id, type]);

  if (!asset) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white px-6 py-10">
      
      {/* Back */}
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-6 text-sm text-gray-400 hover:text-white"
      >
        ← Back to Dashboard
      </button>

      {/* Container */}
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">{asset.title}</h1>

          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 capitalize">
              {type}
            </span>

            {asset.status && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  asset.status === "tokenized"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {asset.status}
              </span>
            )}
          </div>
        </div>

        {/* Valuation Card */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-xl p-6 mb-6">
          <p className="text-gray-400 text-sm">Valuation</p>
          <h2 className="text-3xl font-semibold mt-2">
            ₹{Number(asset.price).toLocaleString()}
          </h2>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {asset.weight && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-500">Weight</p>
              <p className="text-lg mt-1">{asset.weight} g</p>
            </div>
          )}

          {asset.purity && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-500">Purity</p>
              <p className="text-lg mt-1">{asset.purity}</p>
            </div>
          )}

          {asset.asset_form && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-500">Form</p>
              <p className="text-lg mt-1 capitalize">
                {asset.asset_form}
              </p>
            </div>
          )}

          {asset.huid_numbers && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-500">HUID Numbers</p>
              <p className="text-sm mt-1 break-words">
                {Array.isArray(asset.huid_numbers)
                  ? asset.huid_numbers.join(", ")
                  : asset.huid_numbers}
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        {asset.description && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-sm text-gray-400 mb-2">
              Description
            </p>
            <p className="text-gray-300 leading-relaxed">
              {asset.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}