import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import { PenLine, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  useLoginUserMutation,
  useLoginWithGoogleMutation,
} from "@/features/apis/auth-apis";
import { useAuth } from "@/features/context/auth-context";
import { loginValidationSchema } from "@/helpers/form-validators";

export default function SignInPage() {
  const [, navigate] = useLocation();
  const { checkUserIsAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const [
    loginWithGoogle,
    {
      isLoading: _googleIsLoading,
      error: googleError,
      isError: googleIsError,
      data: googleData,
      isSuccess: googleIsSuccess,
    },
  ] = useLoginWithGoogleMutation();

  const [loginUser, { isLoading, error, data, isSuccess }] =
    useLoginUserMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      loginUser(values);
    },
  });

  useEffect(() => {
    if (isSuccess && data) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("token", data?.refreshToken);
      checkUserIsAuthenticated({
        ...googleData?.user,
        name: `${googleData?.user?.firstName} ${googleData?.user?.lastName}`,
      });
      navigate("/");
    }
    if (error) {
      const errorMessage =
        (error as any).data?.message || "An error occurred during sign-in.";
      toast({
        title: "Sign-in Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [isSuccess, data, error, navigate, toast, checkUserIsAuthenticated]);

  useEffect(() => {
    if (googleIsSuccess) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("token", googleData?.refreshToken);
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
            Welcome back. Sign in to continue.
          </p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-8 shadow-sm">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
            Sign in
          </h2>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="you@example.com"
                data-testid="input-email"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="••••••••"
                  className="pr-10"
                  data-testid="input-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.password}
                </div>
              ) : null}
              <div className="text-right">
                <Link href="/password-reset">
                  <span className="text-sm text-primary hover:underline font-medium cursor-pointer">
                    Forgot password?
                  </span>
                </Link>
              </div>
            </div>
            <Button
              disabled={isLoading}
              type="submit"
              className="w-full cursor-pointer"
              size="lg"
              data-testid="button-sign-in"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Sign in
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                loginWithGoogle({ token: credentialResponse.credential });
              }}
              onError={() => {
                toast({
                  title: "Google Sign-in Failed",
                  description: "Something went wrong",
                  variant: "destructive",
                });
              }}
              theme="outline"
              text="continue_with"
              shape="rectangular"
            />
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/sign-up">
              <span className="text-primary hover:underline font-medium cursor-pointer">
                Create one
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
