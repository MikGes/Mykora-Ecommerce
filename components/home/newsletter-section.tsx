"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    toast.success("Subscribed successfully!");
    setEmail("");
  };

  return (
    <section className="bg-[#111827] py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <h2 className="text-2xl font-semibold text-white">Stay in the loop</h2>
        <p className="mt-2 text-gray-400">
          Get exclusive offers, new arrivals, and insider updates delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
          />
          <Button type="submit" variant="accent" disabled={loading}>
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
