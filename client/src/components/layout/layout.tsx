import { useLocation, useRoute } from "wouter";
import Navbar from "./navbar";
import Footer from "./footer";
import Router from "./router";
import { PageMetadata } from "../common/page-metadata";

export default function Layout() {
  const [location] = useLocation();

  const [, params] = useRoute("/blogs/:slug");

  let metaData: { title: string; description: string } = {
    title: "Ade's Notes | Home",
    description: "",
  };

  if (location === "/") {
    metaData = {
      title: "Ade's Notes | Home",
      description:
        "Welcome to Ade's Notes. A digital garden of essays, tutorials, and stories designed to spark curiosity and share knowledge on technology, design, and personal growth.",
    };
  } else if (location === "/about") {
    metaData = {
      title: "Ade's Notes | About",
      description:
        "Learn more about Ade's Notes, our mission, and the author behind the articles. Discover the story and purpose of this digital garden.",
    };
  } else if (location === "/blogs") {
    metaData = {
      title: "Ade's Notes | Blogs",
      description:
        "Explore a universe of ideas. Browse through a wide range of articles on web development, design, technology, and personal growth. Find your next great read on Ade's Notes.",
    };
  } else if (location === `/blogs/${params?.slug}`) {
    metaData = {
      title: `${params?.slug} | Ade's Notes`,
      description: `Dive deep into the topic of "${params?.slug}". Discover key insights, detailed explanations, and related discussions on Ade's Notes.`,
    };
  } else if (location === "/write") {
    metaData = {
      title: "Ade's Notes | Write",
      description:
        "Create and share your knowledge. Use our rich markdown editor to write, edit, and publish your articles to the world. Start sharing your voice today.",
    };
  } else if (location === "/dashboard") {
    metaData = {
      title: "Ade's Notes | Dashboard",
      description:
        "Manage your content and track your impact. View your post statistics, edit drafts, and see how your articles are performing on Ade's Notes.",
    };
  } else if (location === "/admin") {
    metaData = {
      title: "Ade's Notes | Admin",
      description:
        "Access the central control panel for Ade's Notes. Get a complete overview of platform statistics, including total posts, users, views, and engagement.",
    };
  } else if (location === "/admin/posts") {
    metaData = {
      title: "Ade's Notes | Admin Posts",
      description:
        "Oversee all articles on the platform. Search, view, edit, and manage every post to ensure content quality and consistency.",
    };
  } else if (location === "/admin/users") {
    metaData = {
      title: "Ade's Notes | Admin Users",
      description:
        "Manage the user community of Ade's Notes. View a complete list of registered users and their roles on the platform.",
    };
  } else if (location === "/admin/comments") {
    metaData = {
      title: "Ade's Notes | Admin Comments",
      description:
        "Moderate platform engagement. Review and manage all user comments to maintain a healthy and constructive discussion environment.",
    };
  } else if (location === "/sign-in") {
    metaData = {
      title: "Ade's Notes | Sign In",
      description:
        "Welcome back! Sign in to your Ade's Notes account to continue writing, commenting, and engaging with the community.",
    };
  } else if (location === "/sign-up") {
    metaData = {
      title: "Ade's Notes | Sign Up",
      description:
        "Join the Ade's Notes community. Create an account to start writing your own articles, reacting to posts, and joining the conversation.",
    };
  } else if (location === "/account-verification") {
    metaData = {
      title: "Ade's Notes | Account Verification",
      description: "Verify you account with the OTP sent to your email address",
    };
  } else if (location === "/password-reset") {
    metaData = {
      title: "Ade's Notes | Password Reset",
      description:
        "Reset your password with the OTP sent to your email address",
    };
  } else if (location === "/password-update") {
    metaData = {
      title: "Ade's Notes | Password Update",
      description:
        "Update your password with the OTP sent to your email address",
    };
  } else {
    metaData = {
      title: "404 - Page Not Found",
      description:
        "Oops! The page you're looking for doesn't seem to exist. Let's get you back on track. Explore other articles on Ade's Notes.",
    };
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageMetadata title={metaData.title} description={metaData.description} />
      <header className="">
        <Navbar />
      </header>
      <main className="flex-1">
        <Router />
      </main>
      <Footer />
    </div>
  );
}
