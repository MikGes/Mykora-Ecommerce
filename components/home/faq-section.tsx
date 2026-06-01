"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { mockFaqs } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function FaqSection() {
  return (
    <section className="bg-[#F9FAFB] py-16 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-[#111827] dark:text-white">
          Frequently Asked Questions
        </h2>
        <Accordion.Root type="single" collapsible className="mt-8 space-y-2">
          {mockFaqs.map((faq, i) => (
            <Accordion.Item
              key={i}
              value={`item-${i}`}
              className="overflow-hidden rounded-lg border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950"
            >
              <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-[#111827] hover:bg-gray-50 dark:text-white dark:hover:bg-gray-900 [&[data-state=open]>svg]:rotate-180">
                {faq.question}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform" />
              </Accordion.Trigger>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="px-6 pb-4 text-sm text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
