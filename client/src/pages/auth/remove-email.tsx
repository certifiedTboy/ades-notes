import { useEffect } from "react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import { PenLine, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRemoveEmailFromNewsLettersMutation } from "@/features/apis/user-apis";
import { addEmailToNewsLetterValidationSchema } from "@/helpers/form-validators";

export default function RemoveEmailPage() {
  const { toast } = useToast();

  const [removeEmail, { isLoading, isSuccess, error }] =
    useRemoveEmailFromNewsLettersMutation();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: addEmailToNewsLetterValidationSchema,
    onSubmit: (values) => {
      removeEmail(values);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Email Removed",
        description:
          "Your email has been successfully removed from the newsletter.",
      });
      formik.resetForm();
    }
    if (error) {
      const errorMessage =
        error && "data" in error && (error as any).data?.message
          ? (error as any).data.message
          : "Something went wrong";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [isSuccess, error]);

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
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-8 shadow-sm">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
            Unsubscribe from Newsletter
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Enter your email to unsubscribe from our newsletter.
          </p>
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
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              size="lg"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Unsubscribe
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
