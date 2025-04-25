import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function EmailVerificationError() {
  const [errorMessage, setErrorMessage] = useState("Invalid or Expired Token");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const errorType = searchParams.get("error") || "";
  useEffect(() => {
    if (errorType === "expired")
      setErrorMessage("Your verification link has expired.");
    else if (errorType === "invalid")
      setErrorMessage("Invalid verification link.");
    else if (errorType === "invaliduser") {
      setErrorMessage(`User NOT Found with the email ${email}`);
    } else if (errorType === "blocked") {
      setErrorMessage(
        `user with mail ${email} is blocked. please contact admin`
      );
    } else if (errorType === "verified") {
      setErrorMessage(
        `user with mail ${email} is already verified. try loging in`
      );
    }
  }, [searchParams]);

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      navigate("/");
      alert("Verification email resent successfully!");
    } catch (error) {
      alert("Failed to resend email. Please try again.");
      console.log('error in resending email', error);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-slate-800">
      <Card className="w-96 shadow-xl h-auto">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-200">
            Email Verification Failed
          </h2>
          <p className="text-gray-400 mt-2">{errorMessage}</p>
          <div className="mt-4">
            {email && (errorType === "invalid" || errorType === "expired") && (
              <Button onClick={handleResend} disabled={loading}>
                {loading ? "Resending..." : "Resend Verification Email"}
              </Button>
            )}
          </div>
          <Button
            variant="link"
            className="mt-3 text-blue-600"
            onClick={() =>
              errorType === "verified" ? navigate("/login") : navigate("/")
            }
          >
            {errorType === "verified" ? "login" : "Back to Home"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
