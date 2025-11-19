"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a skeleton loader
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto flex h-28 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          {theme === "dark" ? (
            <Image
              src="/ai-bytes-logo-dark.png"
              alt="AI Bytes Learning"
              width={244}
              height={65}
              className="h-auto w-auto"
              priority
            />
          ) : (
            <Image
              src="/ai-bytes-logo-light.jpg"
              alt="AI Bytes Learning"
              width={244}
              height={65}
              className="h-auto w-auto"
              priority
            />
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-foreground-subtle transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/courses"
            className="text-sm font-medium text-foreground-subtle transition-colors hover:text-foreground"
          >
            Courses
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-foreground-subtle transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-foreground-subtle transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-foreground-subtle transition-colors hover:text-foreground"
          >
            Blog
          </Link>
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden items-center space-x-3 md:flex">
          <Link href="/admin/generator">
            <Button variant="ghost" size="sm" className="text-foreground-subtle">
              <Settings className="w-4 h-4 mr-1" />
              Admin
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-foreground-subtle"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
          <Link href="/auth/signin">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm">
              Start Free Trial
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground-subtle" />
          ) : (
            <Menu className="h-6 w-6 text-foreground-subtle" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container mx-auto flex flex-col space-y-4 px-4 py-6">
            <Link
              href="/"
              className="text-sm font-medium text-foreground-subtle transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/courses"
              className="text-sm font-medium text-foreground-subtle transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-foreground-subtle transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-foreground-subtle transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-foreground-subtle transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/admin/generator"
              className="text-sm font-medium text-foreground-subtle transition-colors hover:text-foreground flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Link>
            <div className="pt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-4 h-4 mr-2" />
                    Switch to Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 mr-2" />
                    Switch to Dark Mode
                  </>
                )}
              </Button>
              <Link href="/auth/signin" className="block">
                <Button variant="ghost" className="w-full" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" className="block">
                <Button className="w-full" size="sm">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
