"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
  variant: 'plumber' | 'restaurant' | 'medical';
  title?: string;
  subtitle?: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const variantStyles = {
  plumber: {
    bg: "bg-white",
    card: "bg-blue-50 border-blue-100 hover:border-blue-300",
    cardActive: "bg-blue-100 border-blue-400",
    icon: "text-blue-600",
    iconBg: "bg-blue-100",
    title: "text-gray-900",
    question: "text-gray-900",
    answer: "text-gray-700",
    chevron: "text-blue-600"
  },
  restaurant: {
    bg: "bg-white",
    card: "bg-amber-50 border-amber-100 hover:border-amber-300", 
    cardActive: "bg-amber-100 border-amber-400",
    icon: "text-amber-600",
    iconBg: "bg-amber-100",
    title: "text-gray-900",
    question: "text-gray-900",
    answer: "text-gray-700",
    chevron: "text-amber-600"
  },
  medical: {
    bg: "bg-white",
    card: "bg-green-50 border-green-100 hover:border-green-300",
    cardActive: "bg-green-100 border-green-400", 
    icon: "text-green-600",
    iconBg: "bg-green-100",
    title: "text-gray-900",
    question: "text-gray-900",
    answer: "text-gray-700",
    chevron: "text-green-600"
  }
};

export function FAQ({
  faqs,
  variant,
  title = "Questions fréquentes",
  subtitle = "Trouvez rapidement les réponses à vos questions",
  theme
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const styles = variantStyles[variant];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={cn("py-20", styles.bg)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className={cn("w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center", styles.iconBg)}>
            <HelpCircle className={cn("w-8 h-8", styles.icon)} />
          </div>
          <h2 className={cn("text-3xl md:text-4xl font-bold mb-4", styles.title)}>
            {title}
          </h2>
          <p className={cn("text-lg md:text-xl", styles.answer)}>
            {subtitle}
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={cn(
                "transition-all duration-300 cursor-pointer",
                openIndex === index ? styles.cardActive : styles.card
              )}>
                <CardContent className="p-0">
                  
                  {/* Question */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-black/5 transition-colors duration-200"
                  >
                    <h3 className={cn("text-lg font-semibold pr-4", styles.question)}>
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className={cn("w-5 h-5", styles.chevron)} />
                    </motion.div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className={cn("text-base leading-relaxed", styles.answer)}>
                            {faq.answer}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h3 className={cn("text-xl font-bold mb-4", styles.title)}>
              Vous ne trouvez pas la réponse à votre question ?
            </h3>
            <p className={cn("text-base mb-6", styles.answer)}>
              {variant === 'plumber' && 'Notre équipe technique est disponible pour répondre à toutes vos questions spécifiques'}
              {variant === 'restaurant' && 'Notre équipe sera ravie de vous renseigner sur nos services et spécialités'}
              {variant === 'medical' && 'Nos praticiens sont disponibles pour répondre à vos questions médicales'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className={cn(
                  "inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white transition-colors duration-200",
                  variant === 'plumber' && "bg-blue-600 hover:bg-blue-700",
                  variant === 'restaurant' && "bg-amber-600 hover:bg-amber-700",
                  variant === 'medical' && "bg-green-600 hover:bg-green-700"
                )}
              >
                Nous contacter
              </a>
              <a
                href="tel:+33612345678"
                className={cn(
                  "inline-flex items-center justify-center px-6 py-3 border-2 text-base font-medium rounded-lg transition-colors duration-200",
                  variant === 'plumber' && "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
                  variant === 'restaurant' && "border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white",
                  variant === 'medical' && "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                )}
              >
                Appeler directement
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}