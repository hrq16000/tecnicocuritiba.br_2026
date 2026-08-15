import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { trackFaqToggle } from "@/lib/analytics";


export type LocalFAQItem = {
  question: string;
  answer: string;
};

interface LocalFAQSectionProps {
  /** Ex: "Perguntas Frequentes - Araucária" */
  title: string;
  /** Perguntas e respostas que serão exibidas e usadas no JSON-LD */
  faqs: LocalFAQItem[];
}

export const LocalFAQSection = ({ title, faqs }: LocalFAQSectionProps) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="py-12 md:py-16 bg-background relative overflow-hidden">
      {/* Schema FAQPage (local) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center reveal-text">
            {title}
          </h2>
          
          <Accordion
            type="single"
            collapsible
            className="space-y-3"
            onValueChange={(value) => {
              const idx = value ? Number(value.replace("item-", "")) : -1;
              if (idx >= 0 && faqs[idx]) {
                trackFaqToggle(faqs[idx].question, "open", "faq_local", idx);
              }
            }}
          >
            {faqs.map((item, idx) => (

              <AccordionItem 
                key={idx} 
                value={`item-${idx}`}
                className="bg-secondary rounded-lg border-none stagger-item hover:shadow-xs transition-shadow"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <AccordionTrigger className="px-5 py-4 text-left font-semibold text-foreground hover:text-accent hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4 text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};