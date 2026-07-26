import { useEffect } from "react";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { addEmailToNewsLetterValidationSchema } from "@/helpers/form-validators";
import { useAddEmailToNewsLetterMutation } from "@/features/apis/user-apis";
import { useToast } from "@/hooks/use-toast";

export default function Newsletter() {
  const [addEmailToNewsLetter, { isLoading, error, isSuccess, isError }] =
    useAddEmailToNewsLetterMutation();

  const { toast } = useToast();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: addEmailToNewsLetterValidationSchema,
    onSubmit: (values) => {
      console.log(values);
      addEmailToNewsLetter(values);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Email added to news letter",
        description: "Your email has been added to the newsletter",
        variant: "default",
      });

      formik.resetForm();
    }

    if (isError && error) {
      const errorMessage =
        error && "data" in error && (error as any).data?.message
          ? (error as any).data.message
          : "Something went wrong";
      toast({
        title: "Error adding email",
        description: errorMessage,
        variant: "destructive",
      });
    }

    if (formik.errors && formik.errors.email) {
      toast({
        title: "Error adding email",
        description: formik.errors.email,
        variant: "destructive",
      });
    }
  }, [error, isSuccess, isError, formik.isSubmitting]);

  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl font-semibold text-foreground mb-4">
            Stay in the loop
          </h2>
          <p className="text-muted-foreground mb-8">
            Get the best stories delivered to your inbox, every week.
          </p>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                id="email"
                name="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="input-newsletter-email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <Button
                data-testid="button-newsletter-subscribe"
                className="flex-none cursor-pointer"
                type="submit"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
                Subscribe
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
