import { motion } from "framer-motion";
import { Link } from "wouter";
import { PenLine } from "lucide-react";

export default function TermsConditionsPage() {
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
            Terms and Conditions
          </h1>
          <p className="text-muted-foreground text-sm">
            Please read these terms and conditions carefully before using our
            platform.
          </p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-8 shadow-sm prose dark:prose-invert max-w-none">
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using Ade's Notes, you agree to be bound by these
            Terms and Conditions and all applicable laws and regulations. If you
            do not agree with any of these terms, you are prohibited from using
            or accessing this site.
          </p>

          <h2 className="text-xl font-semibold mb-2">2. User Conduct</h2>
          <p className="mb-4">
            You agree to use Ade's Notes only for lawful purposes and in a way
            that does not infringe the rights of, restrict or inhibit anyone
            else's use and enjoyment of the platform. Prohibited behavior
            includes harassing or causing distress or inconvenience to any other
            user, transmitting obscene or offensive content, or disrupting the
            normal flow of dialogue within Ade's Notes.
          </p>

          <h2 className="text-xl font-semibold mb-2">
            3. Content Ownership and Responsibility
          </h2>
          <p className="mb-4">
            You retain ownership of any content you submit, post, or display on
            or through Ade's Notes. However, by submitting content, you grant
            Ade's Notes a worldwide, non-exclusive, royalty-free license to use,
            reproduce, adapt, publish, and distribute such content on the
            platform. You are solely responsible for the content you post and
            its legality, reliability, and appropriateness.
          </p>

          <h2 className="text-xl font-semibold mb-2">4. Prohibited Content</h2>
          <p className="mb-4">
            You must not post content that is illegal, offensive, harmful,
            threatening, defamatory, obscene, or otherwise objectionable. This
            includes, but is not limited to, content that promotes
            discrimination, violence, or illegal activities.
          </p>

          <h2 className="text-xl font-semibold mb-2">
            5. Consequences of Non-Compliance
          </h2>
          <p className="mb-4">
            Failure to adhere to these Terms and Conditions may result in
            immediate termination of your access to Ade's Notes, removal of your
            content, and/or other actions as deemed appropriate by the platform
            administrators, without prior notice. Serious violations may also
            lead to legal action.
          </p>

          <p className="text-sm text-muted-foreground mt-6">
            Last updated: July 26, 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
}
