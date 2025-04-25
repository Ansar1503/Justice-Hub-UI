import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function EmailVerificationSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-slate-800">
      <Card className="w-96 shadow-xl h-auto">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Email Verified Successfully
          </h2>
          <p className="text-gray-400 mt-2">
            Your account is now activated. You can log in to continue.
          </p>
          <div className="mt-4">
            <Button onClick={() => navigate("/login")}>Go to Login</Button>
          </div>    
          <Button
            variant="link"
            className="mt-3 text-blue-600"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
