import { ChevronLeft, Mail } from "lucide-react";
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
import { NavLink } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <Card className="mx-auto w-full max-w-md shadow-xl border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Forgot password?
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your email address and we'll send you a link to reset your
              password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium leading-none"
                >
                  Email address
                </Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  required
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                className="h-11 w-full text-base font-semibold transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
              >
                Send Reset Link
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
