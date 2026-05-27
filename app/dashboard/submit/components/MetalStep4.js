"use client";

import { useState } from "react";

const LABS = {
  tuv: "TÜV SÜD India",
  sgs: "SGS India",
  bureau: "Bureau Veritas",
};

export default function MetalStep4({ form, setStep }) {
  const [lab, setLab] = useState("");
  const [status, setStatus] = useState("idle");
  // idle → processing → done

  const [result, setResult] = useState(null);

  const startAssay = () => {
    if (!lab) {
      alert("Select an assay lab");
      return;
    }

    setStatus("processing");

    setTimeout(() => {
      const declared = parseFloat(form.purity);

      // Slight variation
      const actual = (declared - Math.random() * 0.005).toFixed(3);

      const isMatch = Math.abs(declared - actual) < 0.02;

      // Fake spot price (important for realism)
      const spotPricePerGram = 6000 + Math.floor(Math.random() * 200);

      const certificateId = "AC-" + Math.floor(Math.random() * 1000000);

      setResult({
        declared,
        actual,
        status: isMatch ? "verified" : "flagged",
        lab: LABS[lab],
        certificateId,
        spotPricePerGram,
      });

      setStatus("done");
    }, 1800);
  };

  const downloadCertificate = () => {
    if (!result) return;

    const content = `
ASSAY CERTIFICATE

Certificate ID: ${result.certificateId}
Lab: ${result.lab}

Declared Purity: ${result.declared}
Tested Purity: ${result.actual}

Status: ${
      result.status === "verified"
        ? "Verified - Within acceptable tolerance"
        : "Minor deviation detected"
    }

Spot Price Locked: ₹${result.spotPricePerGram}/g

This certificate is digitally issued for verification purposes.
`;

    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `assay_certificate_${result.certificateId}.pdf`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">
          Independent Assay Verification
        </h1>
        <p className="text-gray-400 text-sm">
          Step 4: BIS-certified assayer verifies purity at vault
        </p>
      </div>

      {/* Lab Selection */}
      <select
        className="w-full p-3 mb-4 bg-white/5 border border-white/10 rounded-lg"
        value={lab}
        onChange={(e) => setLab(e.target.value)}
      >
        <option value="">Select Assay Lab</option>
        <option value="tuv">TÜV SÜD India</option>
        <option value="sgs">SGS India</option>
        <option value="bureau">Bureau Veritas</option>
      </select>

      {/* Context box */}
      {lab && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-400 mb-1">Assigned Assayer</p>
          <p className="font-medium">{LABS[lab]}</p>

          <p className="text-xs text-gray-500 mt-2">
            The selected BIS-certified assayer will test the asset at the vault
            and issue a digital assay certificate.
          </p>
        </div>
      )}

      {/* Action */}
      {status === "idle" && (
        <button
          onClick={startAssay}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg"
        >
          Initiate Assay Testing
        </button>
      )}

      {/* Processing */}
      {status === "processing" && (
        <div className="text-center py-4 text-yellow-400">
          🔬 Testing sample, verifying purity & issuing certificate...
        </div>
      )}

      {/* Result */}
      {status === "done" && result && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-400 mb-2">Assay Certificate</p>

          <p className="text-sm mb-1">
            Certificate ID:{" "}
            <span className="font-medium">{result.certificateId}</span>
          </p>

          <p className="text-sm mb-1">
            Lab: <span className="font-medium">{result.lab}</span>
          </p>

          <p className="text-sm mt-3">
            Declared Purity:{" "}
            <span className="font-medium">{result.declared}</span>
          </p>

          <p className="text-sm">
            Tested Purity: <span className="font-medium">{result.actual}</span>
          </p>

          {result.status === "verified" ? (
            <p className="text-green-400 mt-2">
              ✔ Verified – within acceptable tolerance
            </p>
          ) : (
            <p className="text-yellow-400 mt-2">
              ⚠ Minor deviation detected (acceptable range)
            </p>
          )}

          {/* Spot Price Lock */}
          <div className="mt-4 border-t border-white/10 pt-3">
            <p className="text-sm text-gray-400">Spot Price Locked</p>
            <p className="text-lg font-semibold">
              ₹{result.spotPricePerGram}/g
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Asset valuation will be based on this locked price.
            </p>
          </div>

          <button
            onClick={downloadCertificate}
            className="w-full mt-4 bg-white/10 hover:bg-white/20 border border-white/10 p-2 rounded-lg text-sm transition"
          >
            Download Assay Certificate (PDF)
          </button>
        </div>
      )}

      {/* Continue */}
      <button
        disabled={status !== "done"}
        onClick={() => setStep(5)}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-medium disabled:opacity-50"
      >
        Continue
      </button>

      {/* Back */}
      <button
        onClick={() => setStep(3)}
        className="w-full mt-4 text-sm text-gray-400 hover:text-white"
      >
        ← Back
      </button>
    </>
  );
}
