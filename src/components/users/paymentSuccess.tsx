import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Calendar,
  Clock,
  CreditCard,

} from "lucide-react";
import { useEffect, useState } from "react";
import axiosinstance from "@/utils/api/axios/axios.instance";
import { toast } from "react-toastify";
import { store } from "@/store/redux/store";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function Component() {
  const { token } = store.getState().Auth;
  const navigate = useNavigate()
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const sessionId = queryParams.get("session_id");
    setSessionId(sessionId);
  }, []);
  const [paymentDetails, setPaymentDetails] = useState({
    lawyerName: "",
    date: "",
    time: "",
    amount: "",
    sessionId: "",
  });
  useEffect(() => {
    if (sessionId) {
      axiosinstance
        .get(`/api/client/stripe/session/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((data) => {
          console.log("reciedfsvasdn", data.data);
          const response = data?.data
          setPaymentDetails({
            amount:response?.amount,
            lawyerName:response?.lawyer,
            date:response?.date,
            time:response?.slot,
            sessionId:sessionId,
          });
        })
        .catch((error: any) => {
          const message =
            error.response?.data?.message || "Booking failed! Try again.";
          error.message = message;
          toast.error(message);
        });
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Payment Successful!
          </CardTitle>
          <CardDescription>
            Your consultation has been confirmed and paid for successfully.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Lawyer</span>
              <span className="text-sm font-semibold">
                {paymentDetails.lawyerName|| "N/A"}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Date</span>
              </div>
              <span className="text-sm font-semibold">
                {paymentDetails.date
                  ? format(new Date(paymentDetails.date), "MMMM d yyyy")
                  : "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Time</span>
              </div>
              <span className="text-sm font-semibold">
                {paymentDetails.time || "N/A"}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">
                  Amount Paid
                </span>
              </div>
              <Badge variant="secondary" className="text-lg font-bold">
                ₹ {paymentDetails.amount|| "N/A"}
              </Badge>
            </div>

            <Separator />

            {/* <div className="space-y-2"> */}
            {/* <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Session ID
                  </span>
                </div> */}
            {/* </div> */}
            {/* <div className=" p-2 rounded text-xs font-mono break-all">
                {sessionId}
              </div> */}
            {/* </div> */}

            {/* <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Transaction ID
                </span>
              </div>
              <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
                {paymentDetails.transactionId}
              </div>
            </div> */}
          </div>

          <div className="space-y-3 pt-4">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => {
                navigate("/");
              }}
            >
              {/* <Download className="h-4 w-4 mr-2" /> */}
              Go to Home
            </Button>

            <Button onClick={()=>{
                navigate("/client/");
            }} className="w-full">Continue to Dashboard</Button>
          </div>

          {/* <div className="text-center text-xs text-gray-500 pt-4">
            <p>
              A confirmation email has been sent to your registered email
              address.
            </p>
            <p className="mt-1">
              Need help? Contact support at support@legalservices.com
            </p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
