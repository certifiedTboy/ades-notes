import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/features/context/auth-context";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { useDeleteUserAccountMutation } from "@/features/apis/user-apis";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { PenLine, User, Mail, Trash2 } from "lucide-react";
import { Link } from "wouter";

export default function AccountSettingsPage() {
  const { user, isAuthenticated, signOut } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [deleteUserAccount, { isLoading: isDeleting, isSuccess, error }] =
    useDeleteUserAccountMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sign-up", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
      });
      signOut();
      navigate("/");
    }
    if (error) {
      const errorMessage =
        "data" in error && (error as any).data?.message
          ? (error as any).data.message
          : "Something went wrong";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [isSuccess, error, toast, navigate]);

  const handleDeleteAccount = () => {
    deleteUserAccount(null);
    setIsDeleteModalOpen(false);
  };

  if (!user) {
    return null; // Or a loading spinner
  }

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
            Account Settings
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your account details and settings.
          </p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={user.picture}
              alt={user.name}
              className="w-20 h-20 rounded-full"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <p className="text-lg font-semibold">{user.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Delete Account
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account. Note that this action is not
              reversible.
            </p>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete My Account
            </Button>
          </div>
        </div>
      </motion.div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="Are you sure you want to delete your account? This will permanently erase all your data. This action cannot be undone."
        confirmText="delete my account"
        isPending={isDeleting}
      />
    </div>
  );
}
