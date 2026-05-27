"use client";

import { useState } from "react";

export default function MetalStep5({ setStep }) {
  const [status, setStatus] = useState("idle"); 
  // idle → processing → checked → signed

  const [result, setResult] = useState(null);

  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState("");

  const runCheck = () => {
    setStatus("processing");

    setTimeout(() => {
      setResult({
        status: "clear",
        message: "No existing liens, pledges, or legal disputes found.",
      });

      setStatus("checked");
    }, 1200);
  };

  const handleSign = () => {
    if (!agreed) {
      alert("You must accept the declaration");
      return;
    }

    if (!signature.trim()) {
      alert("Enter your name as signature");
      return;
    }

    setStatus("signed");
  };

  return (
    <>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">
          Legal Verification & Undertaking
        </h1>
        <p className="text-gray-400 text-sm">
          Step 5: Negative lien check & owner declaration
        </p>
      </div>

      {/* Action */}
      {status === "idle" && (
        <button
          onClick={runCheck}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg"
        >
          Run Lien Check
        </button>
      )}

      {/* Processing */}
      {status === "processing" && (
        <div className="text-center py-4 text-yellow-400">
          🏛️ Verifying ownership across financial registries...
        </div>
      )}

      {/* Result */}
      {(status === "checked" || status === "signed") && result && (
        <>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-2">
              Verification Result
            </p>

            <p className="text-green-400 font-medium">
              ✔ {result.message}
            </p>

            <p className="text-xs text-gray-500 mt-2">
              Checked against financial institutions & pledge records
            </p>
          </div>

          {/* Legal Declaration */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-2">
              Owner Declaration
            </p>

            <p className="text-xs text-gray-500 leading-relaxed">
              I hereby declare that the submitted asset is solely owned by me and
              is free from any liens, pledges, encumbrances, or legal disputes. I
              agree that any false declaration may result in legal consequences
              and forfeiture of tokenization rights.
            </p>

            {/* Checkbox */}
            <label className="flex items-center mt-4 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mr-2"
              />
              I agree to the above declaration
            </label>

            {/* Signature */}
            <input
              type="text"
              placeholder="Type your full name (digital signature)"
              className="w-full mt-3 p-2 bg-white/5 border border-white/10 rounded-lg"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
            />

            {/* Sign Button */}
            {status === "checked" && (
              <button
                onClick={handleSign}
                className="w-full mt-3 bg-green-600 hover:bg-green-700 p-2 rounded-lg text-sm"
              >
                Sign Declaration
              </button>
            )}

            {/* Signed State */}
            {status === "signed" && (
              <p className="text-green-400 text-sm mt-3">
                ✔ Declaration signed by {signature}
              </p>
            )}
          </div>
        </>
      )}

      {/* Continue */}
      <button
        disabled={status !== "signed"}
        onClick={() => setStep(6)}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-medium disabled:opacity-50"
      >
        Continue
      </button>

      {/* Back */}
      <button
        onClick={() => setStep(4)}
        className="w-full mt-4 text-sm text-gray-400 hover:text-white"
      >
        ← Back
      </button>
    </>
  );
}