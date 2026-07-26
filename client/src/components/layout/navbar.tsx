import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Menu,
  X,
  PenLine,
  LayoutDashboard,
  Shield,
  LogOut,
  LogIn,
  Settings,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/features/context/auth-context";
import { useGetUserProfileMutation } from "@/features/apis/user-apis";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const { isAuthenticated, user, checkUserIsAuthenticated, signOut } =
    useAuth();

  const [getUserProfile, { data, isSuccess }] = useGetUserProfileMutation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (!isAuthenticated) {
      getUserProfile(null);
    }
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      checkUserIsAuthenticated({
        ...data?.data,
        name: `${data?.data?.firstName} ${data?.data?.lastName}`,
      });
    }
  }, [data, isSuccess]);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <PenLine className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">
                Ade's Notes
              </span>
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}>
                <motion.span
                  className={`text-sm font-medium transition-colors cursor-pointer ${
                    location === href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  whileHover={{ y: -1 }}
                >
                  {label}
                </motion.span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="p-2 rounded-md hover:bg-muted cursor-pointer transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "light" ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Sun className="w-4 h-4" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            {isAuthenticated && user && user?.role === "user" && (
              <button
                onClick={() => setLocation("/account/settings")}
                className="p-2 rounded-md hover:bg-muted cursor-pointer transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Settings className="w-4 h-4" />
                  </motion.div>
                </AnimatePresence>
              </button>
            )}

            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <>
                    <Link href="/write">
                      <Button
                        size="sm"
                        variant="outline"
                        className="hidden sm:flex gap-2 cursor-pointer"
                        data-testid="link-write"
                      >
                        <PenLine className="w-4 h-4" /> Write
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hidden sm:flex gap-2 text-muted-foreground cursor-pointer"
                        data-testid="link-dashboard"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Link href="/admin">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hidden sm:flex gap-2 text-muted-foreground cursor-pointer"
                        data-testid="link-admin"
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-2">
                  <img
                    src={user?.picture}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full cursor-pointer"
                  />
                  <button
                    onClick={signOut}
                    className="p-2 rounded-md cursor-pointer hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    aria-label="Sign out"
                    data-testid="button-sign-out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="hidden md:inline-block cursor-pointer"
                >
                  <Button
                    size="sm"
                    data-testid="link-sign-up"
                    className="cursor-pointer cursor-pointer"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            <button
              className="md:hidden p-2 rounded-md cursor-pointer hover:bg-muted transition-colors"
              onClick={() => setMenuOpen((m) => !m)}
              data-testid="button-mobile-menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-background/95 backdrop-blur-md border-t border-border"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href}>
                  <span className="block text-sm font-medium text-foreground py-2">
                    {label}
                  </span>
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link href="/write">
                    <span className="block text-sm font-medium text-primary py-2">
                      Write
                    </span>
                  </Link>
                  <Link href="/dashboard">
                    <span className="block text-sm font-medium text-muted-foreground py-2">
                      Dashboard
                    </span>
                  </Link>
                  <button
                    // onClick={signOut}
                    className="text-left text-sm font-medium text-muted-foreground py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/sign-in">
                    <span className="block text-sm font-medium text-muted-foreground py-2 flex items-center gap-2">
                      <LogIn className="w-4 h-4" /> Get Started
                    </span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
