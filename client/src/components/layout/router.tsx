import { Switch, Route } from "wouter";
import HomePage from "@/pages/home/home-page";
import BlogPage from "@/pages/blogs/blog-page";
import PostDetailPage from "@/pages/blogs/post-detail-page";
import WritePage from "@/pages/admin/write-page";
import DashboardPage from "@/pages/admin/dashboard-page";
import AdminDashboard from "@/pages/admin/admin-dashboard";
import AdminPostsPage from "@/pages/admin/admin-posts-page";
import AdminUsersPage from "@/pages/admin/admin-users-page";
import AdminCommentsPage from "@/pages/admin/admin-comments-page";
import SignInPage from "@/pages/auth/signin-page";
import SignUpPage from "@/pages/auth/signup-page";
import AccountVerificationPage from "@/pages/auth/account-verification-page";
import PasswordResetRequestPage from "@/pages/auth/password-reset-request-page";
import PasswordUpdatePage from "@/pages/auth/password-update-page";
import TermsConditionsPage from "@/pages/auth/terms-conditions";
import PrivacyPolicyPage from "@/pages/auth/privacy-policy";
import RemoveEmailPage from "@/pages/auth/remove-email";
import AccountSettingsPage from "@/pages/auth/account-settings";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";

export default function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/blogs" component={BlogPage} />
      <Route path="/about" component={About} />
      <Route path="/blogs/:slug" component={PostDetailPage} />
      <Route path="/write" component={WritePage} />
      <Route path="/write/:id" component={WritePage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/posts" component={AdminPostsPage} />
      <Route path="/admin/users" component={AdminUsersPage} />
      <Route path="/admin/comments" component={AdminCommentsPage} />
      <Route path="/sign-in" component={SignInPage} />
      <Route path="/sign-in/:rest*" component={SignInPage} />
      <Route path="/sign-up" component={SignUpPage} />
      <Route path="/account-verification" component={AccountVerificationPage} />
      <Route path="/password-reset" component={PasswordResetRequestPage} />
      <Route path="/password-update" component={PasswordUpdatePage} />
      <Route path="/terms-conditions" component={TermsConditionsPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/unsubcribe" component={RemoveEmailPage} />
      <Route path="/account/settings" component={AccountSettingsPage} />
      <Route path="/sign-up/:rest*" component={SignUpPage} />
      <Route component={NotFound} />
    </Switch>
  );
}
