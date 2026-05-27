"use client";

export default function StepProgress({ step }) {
  const steps = [
    "Asset",
    "Documents",
    "Vault",
    "Assay",
    "Legal",
    "Value",
    "Tokenize",
  ];

  const progressPercent = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="mb-8">
      {/* Progress Line Background */}
      <div className="relative">
        <div className="absolute top-3 left-0 w-full h-[3px] bg-white/10 rounded-full" />

        {/* Filled Progress */}
        <div
          className="absolute top-3 left-0 h-[3px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = step === stepNumber;
            const isCompleted = step > stepNumber;

            return (
              <div
                key={index}
                className="flex flex-col items-center w-12"
              >
                {/* Circle */}
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-green-500 text-black shadow-md"
                      : isActive
                      ? "bg-blue-500 text-white scale-110 shadow-lg shadow-blue-500/40"
                      : "bg-white/10 text-gray-400"
                  }`}
                >
                  {stepNumber}
                </div>

                {/* Label */}
                <span
                  className={`mt-2 text-[11px] text-center leading-tight
                  ${
                    isActive
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}