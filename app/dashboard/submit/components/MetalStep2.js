"use client";

import { useState } from "react";

export default function MetalStep2({ setStep }) {
  const [docs, setDocs] = useState({
    invoice: { status: "idle", file: null },
    bis: { status: "idle", file: null },
  });

  const simulateValidation = (type, file) => {
    // set uploading
    setDocs((prev) => ({
      ...prev,
      [type]: { status: "processing", file },
    }));

    // simulate backend delay
    setTimeout(() => {
      const isValid = Math.random() > 0.2; // 80% pass rate

      setDocs((prev) => ({
        ...prev,
        [type]: {
          status: isValid ? "approved" : "rejected",
          file,
        },
      }));
    }, 1500);
  };

  const renderStatus = (status) => {
    switch (status) {
      case "processing":
        return "⏳ Processing...";
      case "approved":
        return "✅ Verified";
      case "rejected":
        return "❌ Rejected";
      default:
        return "";
    }
  };

  const isReady =
    docs.invoice.status === "approved" &&
    docs.bis.status === "approved";

  return (
    <>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">
          Document Verification
        </h1>
        <p className="text-gray-400 text-sm">
          Step 2: Upload purchase and certification documents
        </p>
      </div>

      {/* Invoice */}
      <div className="mb-4">
        <label className="block text-sm mb-2">
          Purchase Invoice *
        </label>

        <input
          type="file"
          className="w-full mb-2 text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-800 file:text-white hover:file:bg-gray-700"
          onChange={(e) =>
            simulateValidation("invoice", e.target.files[0])
          }
        />

        <p className="text-sm">
          {renderStatus(docs.invoice.status)}
        </p>
      </div>

      {/* BIS */}
      <div className="mb-4">
        <label className="block text-sm mb-2">
          BIS Hallmark Certificate *
        </label>

        <input
          type="file"
          className="w-full mb-2 text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-800 file:text-white hover:file:bg-gray-700"
          onChange={(e) =>
            simulateValidation("bis", e.target.files[0])
          }
        />

        <p className="text-sm">
          {renderStatus(docs.bis.status)}
        </p>
      </div>

      {/* Continue */}
      <button
        disabled={!isReady}
        onClick={() => setStep(3)}
        className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-medium disabled:opacity-50"
      >
        Continue
      </button>

      {/* Back */}
      <button
        onClick={() => setStep(1)}
        className="w-full mt-4 text-sm text-gray-400 hover:text-white"
      >
        ← Back
      </button>
    </>
  );
}