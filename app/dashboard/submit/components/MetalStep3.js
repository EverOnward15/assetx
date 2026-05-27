"use client";

import { useState } from "react";

const VAULTS = {
  brinks: {
    name: "Brinks Vault - Mumbai",
    address: "Brinks India Pvt Ltd, Andheri East, Mumbai",
  },
  sequel: {
    name: "Sequel Logistics - Pune",
    address: "Sequel Logistics Pvt Ltd, Shivajinagar, Pune",
  },
  malca: {
    name: "Malca Amit - Delhi",
    address: "Malca Amit India Pvt Ltd, Karol Bagh, Delhi",
  },
};

export default function MetalStep3({ setStep }) {
  const [vault, setVault] = useState("");
  const [status, setStatus] = useState("idle"); // idle → processing → done
  const [receiptId, setReceiptId] = useState(null);

  const [vaultDoc, setVaultDoc] = useState(null);
  const [weightDoc, setWeightDoc] = useState(null);
  const [docStatus, setDocStatus] = useState("idle"); // idle → uploading → verified

  const selectedVault = VAULTS[vault];

  const handleDeposit = () => {
    if (!vault) {
      alert("Please select a vault");
      return;
    }

    setStatus("processing");

    setTimeout(() => {
      const fakeReceipt = "VR-" + Math.floor(Math.random() * 1000000);
      setReceiptId(fakeReceipt);
      setStatus("done");
    }, 1200);
  };

  const handleDocsUpload = () => {
    if (!vaultDoc || !weightDoc) {
      alert("Upload both documents");
      return;
    }

    setDocStatus("uploading");

    setTimeout(() => {
      setDocStatus("verified");
    }, 800);
  };

  return (
    <>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">Custodian Deposit</h1>
        <p className="text-gray-400 text-sm">
          Step 3: Deposit asset into a secure vault
        </p>
      </div>

      {/* Vault Selection */}
      <select
        className="w-full p-3 mb-4 bg-white/5 border border-white/10 rounded-lg"
        value={vault}
        onChange={(e) => setVault(e.target.value)}
      >
        <option value="">Select Vault Location for Deposit</option>
        <option value="brinks">Brinks Vault - Mumbai</option>
        <option value="sequel">Sequel Logistics - Pune</option>
        <option value="malca">Malca Amit - Delhi</option>
      </select>

      {/* Vault Details */}
      {selectedVault && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-400 mb-1">Deposit Location</p>
          <p className="font-medium">{selectedVault.name}</p>
          <p className="text-sm text-gray-400">📍 {selectedVault.address}</p>

          <p className="text-xs text-gray-500 mt-3">
            Visit this location and deposit your asset. The vault operator will
            verify weight & purity and generate a receipt.
          </p>
        </div>
      )}

      {/* Deposit Action */}
      {status === "idle" && (
        <button
          onClick={handleDeposit}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg"
        >
          I Have Deposited the Asset
        </button>
      )}

      {/* Processing */}
      {status === "processing" && (
        <div className="text-center py-4 text-yellow-400">
          ⏳ Verifying deposit with vault operator...
        </div>
      )}

      {/* Deposit Complete */}
      {status === "done" && (
        <>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-1">Vault Receipt ID</p>
            <p className="text-lg font-semibold">{receiptId}</p>

            <p className="text-green-400 text-sm mt-2">
              ✔ Deposit confirmed by vault operator
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-3">
              Upload Verification Documents
            </p>

            {/* Vault Receipt Upload */}
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setVaultDoc(e.target.files[0])}
              className="w-full mb-3 text-sm text-gray-300
    file:mr-4 file:py-2 file:px-4
    file:rounded-lg file:border-0
    file:bg-blue-600 file:text-white
    file:cursor-pointer
    hover:file:bg-blue-700
    file:transition"
            />

            {/* Weight Certificate Upload */}
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setWeightDoc(e.target.files[0])}
              className="w-full mb-3 text-sm text-gray-300
    file:mr-4 file:py-2 file:px-4
    file:rounded-lg file:border-0
    file:bg-blue-600 file:text-white
    file:cursor-pointer
    hover:file:bg-blue-700
    file:transition"
            />

            {/* Upload Button */}
            {docStatus === "idle" && (
              <button
                onClick={handleDocsUpload}
                className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded-lg text-sm"
              >
                Upload & Verify Documents
              </button>
            )}

            {docStatus === "uploading" && (
              <p className="text-yellow-400 text-sm">
                ⏳ Verifying documents...
              </p>
            )}

            {docStatus === "verified" && (
              <p className="text-green-400 text-sm">
                ✔ Verified by vault operator
              </p>
            )}
          </div>
        </>
      )}

      {/* Continue */}
      <button
        disabled={status !== "done" || docStatus !== "verified"}
        onClick={() => setStep(4)}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-medium disabled:opacity-50"
      >
        Continue
      </button>

      {/* Back */}
      <button
        onClick={() => setStep(2)}
        className="w-full mt-4 text-sm text-gray-400 hover:text-white"
      >
        ← Back
      </button>
    </>
  );
}
