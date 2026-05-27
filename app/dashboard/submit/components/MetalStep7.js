"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MetalStep7({ form, setStep, assetType }) {
  const router = useRouter();

  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);

  const handleTokenization = async () => {
    setStatus("processing");

    setTimeout(async () => {
      const pricePerGram = 6000;

      const totalValue =
        Number(form.weight) * Number(form.purity) * pricePerGram;

      const unitPrice = 100;
      const totalUnits = Math.floor(totalValue / unitPrice);

      const spvName =
        "Metal Asset Trust " + Math.floor(Math.random() * 1000);

      const assetId =
        "MT-" + Math.floor(Math.random() * 1000000);

      setResult({
        spvName,
        totalUnits,
        unitPrice,
        totalValue,
        assetId,
      });

      // API CALL
      try {
        const res = await fetch("/api/metals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...form,
            type: assetType,
            assetForm: form.assetForm,
            purity: Number(form.purity),
            weight: Number(form.weight),
            price: totalValue,
            huidNumbers: form.huidNumbers,
            status: "tokenized",
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("API error:", data);
          alert(data.error || "Failed to save asset");
        }
      } catch (err) {
        console.error("Network error:", err);
      }

      setStatus("done");
    }, 1800);
  };

  return (
    <>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">
          SPV Formation & Unit Issuance
        </h1>
        <p className="text-gray-400 text-sm">
          Step 7: Asset converted into investable units
        </p>
      </div>

      {/* Context */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-400 mb-1">
          Structure
        </p>
        <p className="text-sm">
          A Special Purpose Vehicle (SPV) will be created to hold this asset.
          The custodian retains physical gold on behalf of the SPV.
        </p>
      </div>

      {/* Action */}
      {status === "idle" && (
        <button
          onClick={handleTokenization}
          className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg"
        >
          Create SPV & Issue Units
        </button>
      )}

      {/* Processing */}
      {status === "processing" && (
        <div className="text-center py-6 text-yellow-400">
          ⚙️ Structuring SPV, allocating custody & minting units...
        </div>
      )}

      {/* Result */}
      {status === "done" && result && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-400 mb-2">
            Tokenization Summary
          </p>

          <p className="text-sm">
            Asset ID:{" "}
            <span className="font-medium">{result.assetId}</span>
          </p>

          <p className="text-sm">
            SPV Name:{" "}
            <span className="font-medium">{result.spvName}</span>
          </p>

          <p className="text-sm mt-3">
            Total Asset Value:{" "}
            <span className="font-medium">
              ₹{Number(result.totalValue).toLocaleString()}
            </span>
          </p>

          <p className="text-sm">
            Total Units Issued:{" "}
            <span className="font-medium">{result.totalUnits}</span>
          </p>

          <p className="text-sm">
            Unit Price:{" "}
            <span className="font-medium">₹{result.unitPrice}</span>
          </p>

          <div className="mt-4 border-t border-white/10 pt-3">
            <p className="text-green-400">
              ✔ Asset successfully tokenized
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Units are now available for fractional investment
            </p>
          </div>
        </div>
      )}

      {/* CTA */}
      {status === "done" && (
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-medium"
        >
          Go to Dashboard
        </button>
      )}

      {/* Back */}
      <button
        onClick={() => setStep(6)}
        className="w-full mt-4 text-sm text-gray-400 hover:text-white"
      >
        ← Back
      </button>
    </>
  );
}