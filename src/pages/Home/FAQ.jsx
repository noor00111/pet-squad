import { motion } from "framer-motion";
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import faq from "@/assets/images/faq.jpg"


const FAQ = () => {
  const faqs = [
    {
      question: "How do I adopt a pet?",
      answer:
        "To adopt a pet, browse our listings, choose a pet, and submit an adoption application. Our team will review it and guide you through the process.",
    },
    {
      question: "What are the adoption fees?",
      answer:
        "Adoption fees vary based on the pet's age, breed, and care requirements. Fees cover vaccinations, spaying/neutering, and other medical needs.",
    },
    {
      question: "Do I need a home check before adoption?",
      answer:
        "Yes, a home check ensures that the environment is safe and suitable for the pet. This step helps us match the right pet with the right home.",
    },
    {
      question: "Can I return a pet if it doesn't work out?",
      answer:
        "Yes, we offer a return policy within a specified time frame. We always prioritize the pet’s well-being and will assist in rehoming if needed.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 relative">
      <div
        className="relative overflow-hidden rounded-3xl bg-cover bg-center px-6 py-20 shadow-xl"
        style={{ backgroundImage: `url(${faq})`}}>
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(265,35%,9%)]/40 via-[hsl(265,35%,9%)]/70 to-[hsl(265,35%,9%)]/85 backdrop-blur-[1px]"></div>

        <div className="relative z-10 mb-10 text-center">
          <span className="inline-block font-bodyFont text-sm font-semibold uppercase tracking-[0.18em] text-colorSecondary">
            Got Questions?
          </span>
          <motion.h2
            className="mt-3 text-balance font-headingFont text-3Fxl font-semibold tracking-tight text-white md:text-4xl"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            Your Guide to Pet Adoption
          </motion.h2>
        </div>

        <Accordion
          type="single"
          collapsible
          className="relative z-10 mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-md md:p-8">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`${index}`} className="border-white/10 last:border-0">
              <AccordionTrigger className="py-5 text-left font-bodyFont text-base font-semibold text-white hover:no-underline hover:text-colorSecondary md:text-lg [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-colorSecondary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pr-6 text-sm leading-relaxed text-white/80 md:text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
