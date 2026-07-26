import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PenLine } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Github from "./github";
import Microsoft from "./microsoft";
import Google from "./google";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  useLoginWithGoogleMutation,
  useLoginWithGithubMutation,
} from "@/features/apis/auth-apis";
import { useAuth } from "@/features/context/auth-context";
import { useSigninStrategy } from "@/hooks/use-signin-strategy";

export default function SignUpPage() {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [, navigate] = useLocation();
  const { checkUserIsAuthenticated, user, isAuthenticated } = useAuth();

  const { visitGithubConsentScreen } = useSigninStrategy();

  const [
    loginWithGoogle,
    {
      isLoading: _googleIsLoading,
      error: googleError,
      data: googleData,
      isSuccess: googleIsSuccess,
      isError: googleIsError,
    },
  ] = useLoginWithGoogleMutation();

  const [
    loginWithGithub,
    {
      data: githubData,
      isSuccess: githubSuccess,
      isError: githubIsError,
      error: githubError,
    },
  ] = useLoginWithGithubMutation();

  const { toast } = useToast();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) =>
      loginWithGoogle({ token: tokenResponse.access_token, acceptTerms }),
    flow: "implicit",
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      window.history.back();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const queryString = window?.location.search;

    const urlParams = new URLSearchParams(queryString);

    const githubToken = urlParams.get("code");

    if (githubToken) {
      loginWithGithub({ githubToken, acceptTerms });
    }
  }, []);

  useEffect(() => {
    if (googleIsSuccess) {
      localStorage.setItem("isAuthenticated", "true");
      checkUserIsAuthenticated({
        ...googleData?.user,
        name: `${googleData?.user?.firstName} ${googleData?.user?.lastName}`,
      });
      navigate("/");
    }

    if (googleIsError) {
      const errorMessage =
        googleError &&
        "data" in googleError &&
        (googleError as any).data?.message
          ? (googleError as any).data.message
          : "Something went wrong";
      toast({
        title: "Google Sign-in Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [googleError, googleIsSuccess, googleIsError]);

  useEffect(() => {
    if (githubSuccess) {
      localStorage.setItem("isAuthenticated", "true");
      checkUserIsAuthenticated({
        ...githubData?.user,
        name: `${githubData?.user?.firstName} ${githubData?.user?.lastName}`,
      });
      navigate("/");
    }

    if (githubIsError) {
      const errorMessage =
        githubError &&
        "data" in githubError &&
        (githubError as any).data?.message
          ? (githubError as any).data.message
          : "Something went wrong";
      toast({
        title: "Github Sign-in Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [githubError, githubSuccess, githubIsError]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-amber-50/30 dark:to-amber-950/10 px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center gap-2 cursor-pointer mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <PenLine className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-2xl font-semibold text-foreground">
                Ade's Notes
              </span>
            </div>
          </Link>
          <p className="text-muted-foreground text-sm">
            Join Ade's Notes and start contributing your ideas.
          </p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-8 shadow-sm">
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                continue with
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => {
                if (!acceptTerms) {
                  return toast({
                    title: "Agree to Privacy Policy",
                    description:
                      "You must agree to the Privacy Policy to continue.",
                    variant: "destructive",
                  });
                }
                visitGithubConsentScreen();
              }}
            >
              <Github className="mr-2 h-5 w-5" />
              Continue with Github
            </Button>
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => {
                if (!acceptTerms) {
                  return toast({
                    title: "Agree to Privacy Policy",
                    description:
                      "You must agree to the Privacy Policy to continue.",
                    variant: "destructive",
                  });
                }
              }}
            >
              <Microsoft className="mr-2 h-4 w-4" />
              Continue with Microsoft
            </Button>
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => {
                if (!acceptTerms) {
                  return toast({
                    title: "Agree to Privacy Policy",
                    description:
                      "You must agree to the Privacy Policy to continue.",
                    variant: "destructive",
                  });
                }
                handleGoogleLogin();
              }}
            >
              <Google className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            />
            <Label htmlFor="terms" className="font-normal">
              I have read, and agreed to the{" "}
              <Link href="/privacy-policy">
                <span className="text-primary hover:underline font-medium cursor-pointer">
                  Privacy Policy
                </span>
              </Link>
            </Label>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
