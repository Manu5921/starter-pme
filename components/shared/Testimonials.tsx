"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  text: string;
  rating: number;
  city?: string;
  image?: string;
  service?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
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
    bg: "bg-blue-50",
    card: "bg-white border-blue-100",
    quote: "text-blue-200",
    star: "text-yellow-400",
    name: "text-gray-900",
    text: "text-gray-700",
    city: "text-blue-600",
    title: "text-gray-900"
  },
  restaurant: {
    bg: "bg-amber-50", 
    card: "bg-white border-amber-100",
    quote: "text-amber-200",
    star: "text-yellow-400",
    name: "text-gray-900",
    text: "text-gray-700",
    city: "text-amber-600",
    title: "text-gray-900"
  },
  medical: {
    bg: "bg-green-50",
    card: "bg-white border-green-100", 
    quote: "text-green-200",
    star: "text-yellow-400",
    name: "text-gray-900",
    text: "text-gray-700",
    city: "text-green-600",
    title: "text-gray-900"
  }
};

export function Testimonials({
  testimonials,
  variant,
  title = "Ce que disent nos clients",
  subtitle = "Découvrez l'expérience de ceux qui nous ont fait confiance",
  theme
}: TestimonialsProps) {
  const styles = variantStyles[variant];

  return (
    <section className={cn("py-20", styles.bg)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={cn("text-3xl md:text-4xl font-bold mb-4", styles.title)}>
            {title}
          </h2>
          <p className={cn("text-lg md:text-xl max-w-3xl mx-auto", styles.text)}>
            {subtitle}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={cn(
                "h-full relative overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
                styles.card
              )}>
                
                {/* Quote Icon */}
                <div className="absolute top-4 right-4">
                  <Quote className={cn("w-8 h-8", styles.quote)} />
                </div>

                <CardContent className="p-6">
                  
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn(
                          "w-4 h-4",
                          i < testimonial.rating 
                            ? cn(styles.star, "fill-current") 
                            : "text-gray-300"
                        )} 
                      />
                    ))}
                    <span className={cn("ml-2 text-sm font-medium", styles.text)}>
                      {testimonial.rating}/5
                    </span>
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className={cn("text-base leading-relaxed mb-6", styles.text)}>
                    "{testimonial.text}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      {testimonial.image ? (
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg",
                          variant === 'plumber' && "bg-blue-500",
                          variant === 'restaurant' && "bg-amber-500", 
                          variant === 'medical' && "bg-green-500"
                        )}>
                          {testimonial.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Author Details */}
                    <div className="flex-1">
                      <div className={cn("font-semibold", styles.name)}>
                        {testimonial.name}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {testimonial.city && (
                          <span className={styles.city}>{testimonial.city}</span>
                        )}
                        {testimonial.service && (
                          <>
                            {testimonial.city && <span className={styles.text}>•</span>}
                            <span className={styles.text}>{testimonial.service}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-4xl mx-auto">
            <h3 className={cn("text-2xl font-bold mb-4", styles.title)}>
              {variant === 'plumber' && 'Rejoignez nos clients satisfaits'}
              {variant === 'restaurant' && 'Venez découvrir notre cuisine'}
              {variant === 'medical' && 'Faites-nous confiance pour votre santé'}
            </h3>
            <p className={cn("text-lg mb-6", styles.text)}>
              {variant === 'plumber' && 'Plus de 500 interventions réussies avec un taux de satisfaction de 98%'}
              {variant === 'restaurant' && 'Une expérience culinaire unique qui marquera vos papilles'}
              {variant === 'medical' && 'Des soins de qualité dans un environnement bienveillant'}
            </p>
            
            {/* Average Rating Display */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <div className={cn("text-3xl font-bold", styles.name)}>
                  {(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn("w-4 h-4", styles.star, "fill-current")} 
                    />
                  ))}
                </div>
                <div className={cn("text-sm", styles.text)}>
                  Moyenne sur {testimonials.length} avis
                </div>
              </div>
              
              <div className="h-12 w-px bg-gray-300" />
              
              <div className="text-center">
                <div className={cn("text-3xl font-bold", styles.name)}>
                  98%
                </div>
                <div className={cn("text-sm", styles.text)}>
                  De clients satisfaits
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}