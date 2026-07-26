import { motion } from "framer-motion";
import { Link } from "wouter";
import { PenLine } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-amber-50/30 dark:to-amber-950/10 px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
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
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-sm">
            Your privacy is important to us.
          </p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-8 shadow-sm prose dark:prose-invert max-w-none">
          <p className="mb-4">
            This Privacy Policy explains how Ade's Notes collects, uses, and
            discloses information about you. This policy applies when you use
            our website, and other online products and services that link to
            this Privacy Policy.
          </p>

          <h2 className="text-xl font-semibold mb-2">
            1. Information We Collect
          </h2>
          <p className="mb-4">
            When you sign up or log in using a third-party service like Google,
            GitHub, or Microsoft, we collect information that the service
            provides to us. This typically includes:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your full name</li>
            <li>Your email address</li>
            <li>Your profile picture</li>
          </ul>
          <p className="mb-4">
            We use this information solely to create and manage your account on
            Ade's Notes. We do not request or store your password for these
            services.
          </p>

          <h2 className="text-xl font-semibold mb-2">
            2. How We Use Your Information
          </h2>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve
            our services. This includes:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Authenticating you when you log in.</li>
            <li>
              Personalizing your experience, such as displaying your name and
              profile picture.
            </li>
            <li>
              Communicating with you, including sending newsletters if you have
              opted in.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mb-2">
            3. Your Rights and Choices
          </h2>
          <p className="mb-4">
            You have control over your personal information and how it is used.
            We provide you with the following options:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Account Deletion:</strong> You have the right to delete or
              deactivate your account at any time through your account settings
              or by contacting us.
              <Link href="/account/settings">
                {" "}
                <span className="text-primary hover:underline font-medium cursor-pointer">
                  Delete Account
                </span>{" "}
              </Link>
            </li>
            <li>
              <strong>Content Removal:</strong> You can delete any comments you
              have posted on the platform.
            </li>
            <li>
              <strong>Email Subscriptions:</strong> You can unsubscribe from our
              newsletters and promotional emails by following the "unsubscribe"
              link in those emails.{" "}
              <Link href="/unsubcribe">
                {" "}
                <span className="text-primary hover:underline font-medium cursor-pointer">
                  Unsubscribe from newsletters
                </span>{" "}
              </Link>
            </li>
          </ul>

          <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
          <p className="mb-4">
            We take reasonable measures to help protect information about you
            from loss, theft, misuse, and unauthorized access, disclosure,
            alteration, and destruction.
          </p>

          <h2 className="text-xl font-semibold mb-2">5. User Responsibility</h2>
          <p className="mb-4">
            While we take steps to protect your information, you also play a
            role in keeping your data safe. You are responsible for safeguarding
            your account credentials for third-party services (e.g., Google,
            GitHub, Microsoft) and for any activity that occurs under your
            account.
          </p>

          <p className="text-sm text-muted-foreground mt-6">
            Last updated: July 26, 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
}
