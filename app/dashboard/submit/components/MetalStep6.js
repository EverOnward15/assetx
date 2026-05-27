"use client";

import { useState } from "react";

export default function MetalStep6({ form, assetType, setStep }) {
  const [status, setStatus] = useState("idle"); 
  // idle → processing → locked

  const [valuation, setValuation] = useState(null);

  const lockValuation = () => {
    setStatus("processing");

    setTimeout(() => {
      const pricePerGram =
        assetType === "gold"
          ? 6000 + Math.floor(Math.random() * 200)
          : 75 + Math.floor(Math.random() * 5);

      const weight = Number(form.weight);
      const purity = Number(form.purity);

      const adjustedWeight = weight * purity;
      const totalValue = adjustedWeight * pricePerGram;

      const now = new Date();
      const expiry = new Date();
      expiry.setDate(now.getDate() + 30);

      setValuation({
        pricePerGram,
        adjustedWeight: adjustedWeight.toFixed(2),
        totalValue: totalValue.toFixed(2),
        timestamp: now.toLocaleString(),
        expiry: expiry.toLocaleDateString(),
        source: assetType === "gold" ? "MCX Gold Spot" : "IBJA Silver Spot",
      });

      setStatus("locked");
    }, 1200);
  };

  return (
    <>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">
          Spot Price Valuation Lock
        </h1>
        <p className="text-gray-400 text-sm">
          Step 6: Market-based valuation & lock-in
        </p>
      </div>

      {/* Market Source */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-400">
          Data Source
        </p>
        <p className="font-medium">
          {assetType === "gold"
            ? "MCX Gold Spot Feed"
            : "IBJA Silver Spot Feed"}
        </p>

        <p className="text-xs text-gray-500 mt-2">
          Live market rates are fetched and locked for valuation.
        </p>
      </div>

      {/* Action */}
      {status === "idle" && (
        <button
          onClick={lockValuation}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg"
        >
          Fetch & Lock Market Price
        </button>
      )}

      {/* Processing */}
      {status === "processing" && (
        <div className="text-center py-4 text-yellow-400">
          📊 Fetching live spot price & computing valuation...
        </div>
      )}

      {/* Result */}
      {status === "locked" && valuation && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-400 mb-2">
            Valuation Summary
          </p>

          <p className="text-sm">
            Price Source:{" "}
            <span className="font-medium">{valuation.source}</span>
          </p>

          <p className="text-sm">
            Locked At:{" "}
            <span className="font-medium">{valuation.timestamp}</span>
          </p>

          <p className="text-sm mt-3">
            Adjusted Weight:{" "}
            <span className="font-medium">
              {valuation.adjustedWeight} g
            </span>
          </p>

          <p className="text-sm">
            Price per gram:{" "}
            <span className="font-medium">
              ₹{valuation.pricePerGram}
            </span>
          </p>

          <p className="text-xl font-semibold mt-2">
            Total Value: ₹{valuation.totalValue}
          </p>

          {/* Lock Info */}
          <div className="mt-4 border-t border-white/10 pt-3">
            <p className="text-green-400 text-sm">
              ✔ Valuation locked for 30 days
            </p>
            <p className="text-xs text-gray-500">
              Expires on: {valuation.expiry}
            </p>
          </div>
        </div>
      )}

      {/* Continue */}
      <button
        disabled={status !== "locked"}
        onClick={() => setStep(7)}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-medium disabled:opacity-50"
      >
        Continue
      </button>

      {/* Back */}
      <button
        onClick={() => setStep(5)}
        className="w-full mt-4 text-sm text-gray-400 hover:text-white"
      >
        ← Back
      </button>
    </>
  );
}