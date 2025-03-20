import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useLocation } from "react-router-dom";
import React, { useRef, useState } from "react";

function OtpVerification() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const location = useLocation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  //   const email = location.state.email;
  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);
    if ((value || value !== "") && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    } else if (
      event.key === "ArrowLeft" &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    } else if (
      event.key === "ArrowRight" &&
      index < 5 &&
      inputRefs.current[index + 1]
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-slate-700 p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardContent className="p-4 sm:p-6 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-gray-200 mt-4 sm:mt-6">
            OTP VERIFICATION
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-4 sm:mt-6">
            Enter the 6-digit code sent to your email
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-1 sm:gap-2 md:gap-3 mt-4 sm:mt-5">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                type="text"
                aria-label={`OTP digit ${index + 1}`}
                className="w-8 sm:w-10 md:w-12 h-10 sm:h-12 text-base sm:text-lg text-center border rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          {/* Verify Button */}
          <Button className="w-5/12 px-4 py-2 mt-4 sm:mt-5">Verify OTP</Button>

          {/* Resend OTP */}
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-3">
            Didn't receive the OTP?{" "}
            <button className="text-blue-500 hover:underline">Resend</button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default OtpVerification;
