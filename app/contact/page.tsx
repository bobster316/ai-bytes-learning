"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Clock, Send, Home, ChevronRight, CheckCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Navigation Breadcrumb */}
      <nav className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <a href="/" className="flex items-center gap-1 hover:text-[#00BFA5] transition-colors">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Contact</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-background-inverse border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <p className="text-sm uppercase tracking-wider text-foreground-inverse/60">
              GET IN TOUCH
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground-inverse">
              Contact Us
            </h1>
            <p className="text-base text-foreground-inverse/70">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Send us a Message</CardTitle>
                  <p className="text-sm text-foreground/70">
                    Fill out the form below and our team will get back to you within 24 hours.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="John Smith"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-foreground">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-foreground">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more about your enquiry..."
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="resize-none"
                      />
                    </div>
                    {status === "success" && (
                      <div className="flex items-center gap-3 p-4 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl animate-in fade-in slide-in-from-bottom-3 duration-500">
                        <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                        <p className="text-sm text-[#10B981] font-semibold">
                          Thank you! We'll get back to you within 24 hours.
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full md:w-auto h-11 px-8 bg-[#00BFA5] text-white font-semibold rounded-lg hover:bg-[#00A896] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="bg-card border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#00BFA5]/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#00BFA5]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <p className="text-sm text-foreground/70">support@aibytes.learning</p>
                      <p className="text-sm text-foreground/70">hello@aibytes.learning</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#00BFA5]/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#00BFA5]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                      <p className="text-sm text-foreground/70">+44 (0) 20 1234 5678</p>
                      <p className="text-sm text-foreground/70">Mon-Fri, 9am-6pm GMT</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#00BFA5]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#00BFA5]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Office</h3>
                      <p className="text-sm text-foreground/70">123 Learning Street</p>
                      <p className="text-sm text-foreground/70">London, EC2A 4BX</p>
                      <p className="text-sm text-foreground/70">United Kingdom</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#00BFA5]/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#00BFA5]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
                      <p className="text-sm text-foreground/70">Monday - Friday</p>
                      <p className="text-sm text-foreground/70">9:00 AM - 6:00 PM GMT</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background-inverse border-border shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground-inverse mb-2">Looking for Support?</h3>
                  <p className="text-sm text-foreground-inverse/70 mb-4">
                    Check our Help Centre for quick answers to common questions.
                  </p>
                  <Button variant="outline" className="w-full border-border text-foreground-inverse hover:bg-foreground-inverse/10">
                    Visit Help Centre
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <Card className="bg-background border-border">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    How quickly will I receive a response?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70">
                    We aim to respond to all enquiries within 24 hours during business days. For urgent matters, please include "URGENT" in your subject line.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background border-border">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    Do you offer phone support?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70">
                    Phone support is available for Professional plan subscribers. Free and Starter plan users can reach us via email or the contact form.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background border-border">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    Can I schedule a demo or consultation?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70">
                    Yes! Please mention "Demo Request" in your subject line and include your preferred dates and times. We'll arrange a video call with our team.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
