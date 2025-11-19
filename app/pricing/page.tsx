"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Sparkles,
  X,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const plans = [
    {
      name: "Single Course",
      price: billingCycle === "monthly" ? 39 : 39,
      period: "per course",
      description: "For casual learners",
      popular: false,
      features: [
        "Lifetime access to purchased course",
        "All course materials and updates",
        "Certificate upon completion",
        "Own forever, no subscription",
        "Any difficulty level available",
      ],
      limitations: [
        "No offline download",
        "Limited AI companion (10 queries/day)",
        "Standard support (48h response)",
      ],
      cta: "Browse Courses",
      ctaLink: "/courses",
    },
    {
      name: "Unlimited",
      price: billingCycle === "monthly" ? 49 : 470,
      period: billingCycle === "monthly" ? "/month" : "/year",
      originalPrice: billingCycle === "annual" ? 588 : null,
      savings: billingCycle === "annual" ? "Save £118" : null,
      description: "Recommended for active learners",
      popular: true,
      features: [
        "Unlimited courses (Beginner & Intermediate)",
        "New courses added monthly",
        "Download for offline viewing",
        "All certificates",
        "Priority support (24-hour response)",
        "Advanced AI study companion",
        "Cancel anytime",
      ],
      limitations: [],
      cta: "Start 7-Day FREE Trial",
      ctaLink: "/signup",
      note: "No credit card required",
    },
    {
      name: "Professional",
      price: billingCycle === "monthly" ? 99 : 950,
      period: billingCycle === "monthly" ? "/month" : "/year",
      originalPrice: billingCycle === "annual" ? 1188 : null,
      savings: billingCycle === "annual" ? "Save £238" : null,
      description: "For professionals & teams",
      popular: false,
      features: [
        "Everything in Unlimited",
        "Unlimited Advanced courses",
        "1-on-1 monthly Q&A session (30 min)",
        "Private community access",
        "Premium AI companion (unlimited)",
        "Priority support (4-hour response)",
        "Career guidance resources",
        "Beta access to new features",
      ],
      limitations: [],
      cta: "Start Free Trial",
      ctaLink: "/signup",
    },
  ];

  return (
    <div className="min-h-screen bg-card">
      <Header />

      {/* Hero Section */}
      <section className="py-12 bg-background-inverse border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 mb-12">
            <p className="text-sm text-foreground-inverse/60 uppercase tracking-wider">Pricing</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground-inverse">
              Simple, Transparent Pricing
            </h1>
            <p className="text-base text-foreground-inverse/70 max-w-2xl mx-auto">
              Learn AI at Your Own Pace, Your Own Way
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-[#00BFA5] text-foreground-inverse"
                    : "bg-card/10 text-foreground-inverse/60 hover:bg-card/20"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                  billingCycle === "annual"
                    ? "bg-[#00BFA5] text-foreground-inverse"
                    : "bg-card/10 text-foreground-inverse/60 hover:bg-card/20"
                }`}
              >
                Annual
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular
                    ? "border-[#00BFA5] shadow-lg"
                    : "border-border"
                } transition-all hover:border-[#00BFA5]/50 bg-card`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[#00BFA5] text-foreground-inverse px-3 py-1 text-xs">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>

                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold text-foreground">
                        £{plan.price}
                      </span>
                      <span className="text-foreground/70">{plan.period}</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="mt-2">
                        <span className="text-foreground/50 line-through">
                          £{plan.originalPrice}
                        </span>
                        <Badge variant="beginner" className="ml-2">
                          {plan.savings}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Link href={plan.ctaLink}>
                    <Button
                      className="w-full"
                      size="lg"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                  {plan.note && (
                    <p className="text-xs text-center text-foreground/70">
                      {plan.note}
                    </p>
                  )}

                  <div className="space-y-3 pt-4">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-foreground/40 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground/50">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { value: "12,847", label: "Active Learners" },
              { value: "4.8/5", label: "Average Rating" },
              { value: "8,432", label: "Certificates" },
              { value: "92%", label: "Completion" },
            ].map((stat, index) => (
              <div key={index}>
                <p className="text-4xl font-bold text-[#00BFA5] mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-foreground/70 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-12 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-[#10B981]" />
              </div>
              <span className="text-foreground/80">30-Day Money-Back</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-[#2563EB]" />
              </div>
              <span className="text-foreground/80">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#00BFA5]/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-[#00BFA5]" />
              </div>
              <span className="text-foreground/80">Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I switch plans anytime?",
                a: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.",
              },
              {
                q: "What happens after the free trial?",
                a: "After your 7-day free trial, you'll be charged based on your selected plan. You can cancel anytime before the trial ends with no charge.",
              },
              {
                q: "Do purchased courses expire?",
                a: "No! When you purchase a single course, you have lifetime access to that course and all its future updates.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, debit cards, and PayPal through our secure payment processor, Stripe.",
              },
            ].map((faq, index) => (
              <Card key={index} className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-[#00BFA5] flex-shrink-0 mt-0.5" />
                    {faq.q}
                  </CardTitle>
                  <CardDescription className="pl-8">{faq.a}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#00BFA5] to-[#0BA590] rounded-2xl p-10 lg:p-12 text-center space-y-4 max-w-3xl mx-auto shadow-md border border-[#00BFA5]/20">
            <h2 className="text-3xl font-bold text-foreground-inverse">Ready to Master AI?</h2>
            <p className="text-lg text-foreground-inverse/90">
              Start your journey from AI confused to AI confident
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="bg-card text-foreground hover:bg-background">
                Start Your Free Trial
              </Button>
            </Link>
            <p className="text-sm text-foreground-inverse/80">
              No credit card required • Cancel anytime • 7 days free
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
