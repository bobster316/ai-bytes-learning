"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setMessage("Thank you for subscribing!");
      setEmail("");
    }, 1500);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-[#00BFA5]/10 to-[#00A896]/10 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00BFA5]/20">
            <Mail className="w-8 h-8 text-[#00BFA5]" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Stay Updated with AI Insights
          </h2>

          <p className="text-lg text-foreground/70 mb-8">
            Get the latest AI news, tutorials, and exclusive content delivered straight to your inbox.
            Join over 10,000 AI enthusiasts learning together.
          </p>

          {status === "success" ? (
            <div className="flex items-center justify-center gap-3 p-6 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl animate-in fade-in slide-in-from-bottom-3 duration-500">
              <CheckCircle className="w-6 h-6 text-[#10B981]" />
              <p className="text-[#10B981] font-semibold">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setStatus("idle");
                    setMessage("");
                  }}
                  className="h-12 text-base"
                  disabled={status === "loading"}
                />
                {status === "error" && (
                  <p className="text-sm text-[#EF4444] mt-2 text-left">{message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="h-12 px-8 bg-[#00BFA5] text-white font-semibold rounded-lg hover:bg-[#00A896] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          )}

          <p className="text-sm text-foreground/60 mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}
