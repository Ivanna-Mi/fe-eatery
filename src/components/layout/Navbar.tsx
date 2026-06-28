"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Search, ShoppingBag, User } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useSession, signOut } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const apiUser = useAuthStore((s) => s.user);
  const apiPortal = useAuthStore((s) => s.portal);
  const apiAccessToken = useAuthStore((s) => s.accessToken);
  const apiLogout = useAuthStore((s) => s.logout);
  const isApiCustomer = Boolean(
    apiUser && apiPortal === "customer" && apiAccessToken,
  );
  const isLoggedIn = status === "authenticated" || isApiCustomer;
  const cart = useStore((state) => state.cart);
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const [isScrolled, setIsScrolled] = React.useState(false);
  const { scrollY } = useScroll();
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const navLinks = [
    { name: "Home", href: "/dashboard" },
    { name: "Menu", href: "/menu" },
    { name: "Orders", href: "/orders" },
    { name: "Reservasi", href: "/reservations" },
    { name: "Promo", href: "/promo" },
    { name: "About", href: "#about" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          isScrolled
            ? "bg-background/90 backdrop-blur-md border-border/50 shadow-sm py-3"
            : "bg-transparent py-5",
        )}
      >
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shadow-md group-hover:scale-105 transition-transform border-2 border-transparent group-hover:border-primary/20">
                <img
                  src="/logo.png"
                  alt="e-Eatery Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (pathname.startsWith(link.href) &&
                    link.href !== "/dashboard");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors group"
                  >
                    <span
                      className={cn(
                        "relative z-10",
                        isActive
                          ? "text-primary font-bold"
                          : "text-foreground/80 group-hover:text-primary",
                      )}
                    >
                      {link.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-primary/10 rounded-full -z-0"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex rounded-full text-foreground/80 hover:text-primary hover:bg-primary/10"
              >
                <Search className="w-5 h-5" />
              </Button>

              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full text-foreground/80 hover:text-primary hover:bg-primary/10"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Button>
              </Link>

              {isLoggedIn ? (
                <div className="relative hidden sm:block">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full text-foreground/80 hover:text-primary hover:bg-primary/10 overflow-hidden w-12 h-12"
                    onClick={() => setProfileMenuOpen((open) => !open)}
                    aria-expanded={profileMenuOpen}
                  >
                    {session?.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-3xl border border-border/70 bg-card shadow-xl">
                      <Link
                        href="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-4 py-3 text-sm text-foreground hover:bg-muted"
                      >
                        Edit Profile
                      </Link>
                      <button
                        type="button"
                        onClick={async () => {
                          setProfileMenuOpen(false);
                          if (isApiCustomer) {
                            await apiLogout();
                            router.push("/login");
                          } else {
                            await signOut({ callbackUrl: "/login" });
                          }
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-muted"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="hidden sm:block">
                  <Button className="rounded-full font-medium px-6 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30 transition-all">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
