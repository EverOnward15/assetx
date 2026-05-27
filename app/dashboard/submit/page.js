"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MetalStep1 from "./components/MetalStep1";
import MetalStep2 from "./components/MetalStep2";
import MetalStep3 from "./components/MetalStep3";
import MetalStep4 from "./components/MetalStep4";
import MetalStep5 from "./components/MetalStep5";
import MetalStep6 from "./components/MetalStep6";
import MetalStep7 from "./components/MetalStep7";
import StepProgress from "./components/StepProgress";

export default function SubmitAsset() {
  const router = useRouter();

  const [assetType, setAssetType] = useState(null);
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    weight: "",
    purity: "",
    propertyType: "",
    location: "",

    assetForm: "",
    huidNumbers: [
  { value: "", status: "idle" }
],
  });

  const inputStyle =
    "w-full p-3 mb-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition";

  return (
    <div className="relative min-h-[100dvh] overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white px-4">
      {/* Back to Dashboard */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition"
        >
          ← Dashboard
        </button>
      </div>

      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg backdrop-blur-xl bg-white/5 border border-white/10 p-7 rounded-2xl shadow-2xl">

        {/* STEP PROGRESS BAR */}
        {step > 0 && <StepProgress step={step} />} 

        {/* STEP 0: Asset Selection */}
        {step === 0 && (
          <>
            <h1 className="text-2xl font-semibold mb-1 text-center">
              Submit Asset
            </h1>
            <p className="text-gray-400 text-sm mb-6 text-center">
              Choose what you want to tokenize
            </p>

            <div className="grid gap-4">
              <div
                onClick={() => {
                  setAssetType("property");
                  setStep(1);
                }}
                className="cursor-pointer p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-blue-600/20 hover:border-blue-500 transition"
              >
                <h2 className="text-lg font-medium">🏠 Real Estate</h2>
                <p className="text-sm text-gray-400">
                  Houses, apartments, land
                </p>
              </div>

              <div
                onClick={() => {
                  setAssetType("gold");
                  setStep(1);
                }}
                className="cursor-pointer p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-yellow-500/20 hover:border-yellow-400 transition"
              >
                <h2 className="text-lg font-medium">👑 Gold</h2>
                <p className="text-sm text-gray-400">Physical gold assets</p>
              </div>

              <div
                onClick={() => {
                  setAssetType("silver");
                  setStep(1);
                }}
                className="cursor-pointer p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-gray-300/20 hover:border-gray-300 transition"
              >
                <h2 className="text-lg font-medium">🪙 Silver</h2>
                <p className="text-sm text-gray-400">
                  Silver bars, coins, etc.
                </p>
              </div>
            </div>
          </>
        )}


        {/* STEP 1: GOLD / SILVER DETAILS */}
        {step === 1 && (assetType === "gold" || assetType === "silver") && (
          <MetalStep1
            form={form}
            setForm={setForm}
            assetType={assetType}
            setStep={setStep}
            inputStyle={inputStyle}
          />
        )}

        {/* STEP 2: INVOICE AND BIS CERTIFICATE UPLOAD */}
        {step === 2 && <MetalStep2 setStep={setStep} />}

        {/* STEP 3: CUSTODIAN VAULT RECEIPTS */}
        {step === 3 && <MetalStep3 setStep={setStep} />}

        {/* STEP 4: INDEPENDENT LAB THIRD-PARTY VERIFICATION */}
        {step === 4 && <MetalStep4 form={form} setStep={setStep} />}

        {/* STEP 5: GOVERNMENT CLEARANCE */}
        {step === 5 && <MetalStep5 setStep={setStep} />}

        {/* STEP 6: PRICE MOCK */}
        {step === 6 && (
          <MetalStep6 form={form} assetType={assetType} setStep={setStep} />
        )}

        {/* STEP 7: TOKEN FORMATION */}
        {step === 7 && <MetalStep7 form={form} setStep={setStep} assetType={assetType} />}
      </div>
    </div>
  );
}
