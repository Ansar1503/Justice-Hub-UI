import type React from "react";
import { useState } from "react";
import { ChevronLeft, KeyRound, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import { toast } from "sonner";
import axiosinstance from "@/utils/api/axios/axios.instance";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    try {
      await axiosinstance.post("/api/user/reset-password", { password, token });
      toast.success("Password reset successful");
      navigate("/login");
    } catch (error: any) {
      const message = error?.response?.data?.error || "Something went wrong";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-4 md:p-8 min-h-screen">
        <Card className="mx-auto w-full max-w-md shadow-xl border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <KeyRound className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Reset password
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Please enter your new password below to reset your account access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="h-11 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <span className="text-red-500">{error}</span>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full text-base font-semibold transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t bg-muted/30 p-6 pt-6">
            <Button
              variant="link"
              className="h-auto p-0 text-sm text-muted-foreground hover:text-primary transition-colors"
              asChild
            >
              <NavLink to="/login" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to log in
              </NavLink>
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
