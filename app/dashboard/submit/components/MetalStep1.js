import { useState } from "react";

export default function MetalStep1({
  form,
  setForm,
  assetType,
  setStep,
  inputStyle,
}) {
  const [timers, setTimers] = useState({});
  const verifyHUID = (index, value) => {
    const updated = [...form.huidNumbers];

    updated[index] = {
      ...updated[index],
      value,
      status: "checking",
    };

    setForm({ ...form, huidNumbers: updated });

    // clear previous timer
    if (timers[index]) {
      clearTimeout(timers[index]);
    }

    const newTimer = setTimeout(() => {
      let status;

      if (value.length === 0) {
        status = "idle";
      } else if (value.length <= 4) {
        status = "invalid";
      } else {
        status = "valid";
      }

      const updatedAfter = [...updated];
      updatedAfter[index] = {
        ...updatedAfter[index],
        status,
      };

      setForm((prev) => ({
        ...prev,
        huidNumbers: updatedAfter,
      }));
    }, 500);

    setTimers((prev) => ({
      ...prev,
      [index]: newTimer,
    }));
  };

  const hasInvalid = form.huidNumbers.some(
    (h) => h.status === "invalid" || h.value.trim() === "",
  );
  const hasChecking = form.huidNumbers.some((h) => h.status === "checking");

  const isFormIncomplete =
    !form.title || !form.assetForm || !form.weight || !form.purity;

  const disableContinue = hasInvalid || hasChecking || isFormIncomplete;

  return (
    <>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold capitalize">
          {assetType} Details
        </h1>
        <p className="text-gray-400 text-sm">Step 1: Asset Details Entry</p>
      </div>

      {/* Title */}
      <input
        placeholder="Asset Name (e.g. 10g Gold Coin, Jewellery)"
        className={inputStyle}
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      {/* Form Type */}
      <select
        className={inputStyle}
        value={form.assetForm}
        onChange={(e) => setForm({ ...form, assetForm: e.target.value })}
      >
        <option value="">Select Form</option>
        <option value="coin">Coins</option>
        <option value="bar">Bars</option>
        <option value="jewellery">Jewellery</option>
      </select>

      {/* Weight */}
      <input
        placeholder="Total Weight (grams)"
        type="number"
        className={inputStyle}
        value={form.weight}
        onChange={(e) => setForm({ ...form, weight: e.target.value })}
      />

      {/* Purity */}
      <select
        className={inputStyle}
        value={form.purity}
        onChange={(e) => setForm({ ...form, purity: e.target.value })}
      >
        <option value="">Select Purity</option>

        {assetType === "gold" && (
          <>
            <option value="0.999">24K (99.9%)</option>
            <option value="0.916">22K (91.6%)</option>
            <option value="0.75">18K (75%)</option>
          </>
        )}

        {assetType === "silver" && (
          <>
            <option value="0.999">999 (99.9%)</option>
            <option value="0.925">925 (92.5%)</option>
          </>
        )}
      </select>

      {/* HUID Numbers */}
      <div className="mb-3">
        <p className="text-sm text-gray-400 mb-2">HUID Verification</p>

        {form.huidNumbers.map((huid, index) => (
          <div key={index} className="mb-2">
            <div className="relative">
              <input
                placeholder={`HUID #${index + 1}`}
                className={inputStyle}
                value={huid.value}
                onChange={(e) => verifyHUID(index, e.target.value)}
              />

              {/* Status indicator */}
              <div className="absolute right-3 top-3 text-xs">
                {huid.status === "checking" && (
                  <span className="text-yellow-400">Checking...</span>
                )}
                {huid.status === "valid" && (
                  <span className="text-green-400">✔ Verified (BIS)</span>
                )}
                {huid.status === "invalid" && (
                  <span className="text-red-400">✖ Not found</span>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setForm({
              ...form,
              huidNumbers: [...form.huidNumbers, { value: "", status: "idle" }],
            })
          }
          className="text-sm text-blue-400 mt-2"
        >
          + Add another HUID
        </button>
      </div>

      {/* Continue */}
      <button
        disabled={disableContinue}
        onClick={() => setStep(2)}
        className={`w-full p-3 rounded-lg font-medium transition
    ${
      disableContinue
        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
      >
        Continue
      </button>

      {/* Back */}
      <button
        onClick={() => setStep(0)}
        className="w-full mt-4 text-sm text-gray-400 hover:text-white"
      >
        ← Back
      </button>
    </>
  );
}
