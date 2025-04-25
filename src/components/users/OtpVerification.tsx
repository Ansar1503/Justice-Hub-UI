/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import axiosinstance from "@/utils/api/axios/axios.instance";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

function OtpVerification() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();
  // console.log("email:", email);/
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

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

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text").trim();
    console.log(pastedData);
    if (!/^\d+$/.test(pastedData)) return;
    const digits = pastedData.slice(0, 6).split("");
    const newOtp = [...otp];
    digits.forEach((digit, idx) => {
      if (idx < 6) newOtp[idx] = digit;
    });
    setOtp(newOtp);
    if (digits.length < 6) {
      inputRefs.current[Math.min(digits.length, 5)]?.focus();
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await axiosinstance.post("/api/user/resend-otp", { email });
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
      setResendTimer(60);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.code === "ERR_NETWORK") {
        toast.error(error.message);
      } else if (error.response) {
        if (error.response.data) {
          setError(error.response.data?.message);
        }
      }
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      console.log({ email: email, otpValue });
      try {
        const response = await axiosinstance.post(`/api/user/verify-otp`, {
          email,
          otpValue,
        });
        toast.success(response.data?.message);
        setLoading(false);
        navigate("/login");
      } catch (error: any) {
        console.log(error);
        if (error.response) {
          if (error.response.data) {
            setError(error.response.data?.message);
          }
        }
        setLoading(false);
        // setError(error);
      }
      return;
    } else {
      setLoading(false);
      setError("Please enter the complete 6-digit OTP");
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
                onPaste={(e) => handlePaste(e)}
                maxLength={1}
                type="text"
                aria-label={`OTP digit ${index + 1}`}
                className="w-8 sm:w-10 md:w-12 h-10 sm:h-12 text-base sm:text-lg text-center border rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          {/* Button with Framer Motion Loading Bar */}
          <div className="w-full flex justify-center mt-4 sm:mt-5">
            <Button
              onClick={handleVerify}
              disabled={loading}
              className="w-6/12 px-4 py-2 flex items-center justify-center relative overflow-hidden"
            >
              Verify OTP
              {loading && (
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}
            </Button>
          </div>
          <span className="text-red-800">{error}</span>

          {/* Resend OTP */}
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-3">
            Didn't receive the OTP?{" "}
            <button
              onClick={handleResend}
              className={`text-blue-500 ${
                resendTimer > 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:underline"
              }`}
              disabled={resendTimer > 0}
            >
              Resend {resendTimer > 0 && `in ${resendTimer}s`}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default OtpVerification;
