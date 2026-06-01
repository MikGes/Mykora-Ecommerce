import { Star } from "lucide-react";
import { mockTestimonials } from "@/lib/mock-data";

export function TestimonialsSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-[#111827] dark:text-white">
          Trusted by thousands
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {mockTestimonials.map((t) => (
            <div
              key={t.id}
              className="rounded-lg border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">&ldquo;{t.content}&rdquo;</p>
              <div className="mt-4">
                <p className="text-sm font-medium text-[#111827] dark:text-white">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
