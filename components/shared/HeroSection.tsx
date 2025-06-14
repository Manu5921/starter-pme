"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  variant: 'plumber' | 'restaurant' | 'medical';
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaAction: () => void;
  features?: string[];
  backgroundImage?: string;
  stats?: Array<{value: string; label: string}>;
  businessInfo: {
    phone: string;
    city: string;
    openingHours?: string;
    rating?: number;
    reviewsCount?: number;
  };
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const variantStyles = {
  plumber: {
    bg: "bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900",
    accent: "bg-orange-500 hover:bg-orange-600",
    badge: "bg-orange-100 text-orange-800 border-orange-300",
    text: "text-blue-50"
  },
  restaurant: {
    bg: "bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900",
    accent: "bg-red-600 hover:bg-red-700", 
    badge: "bg-amber-100 text-amber-800 border-amber-300",
    text: "text-amber-50"
  },
  medical: {
    bg: "bg-gradient-to-br from-green-900 via-green-800 to-green-900",
    accent: "bg-blue-500 hover:bg-blue-600",
    badge: "bg-green-100 text-green-800 border-green-300",
    text: "text-green-50"
  }
};

export function HeroSection({
  variant,
  headline,
  subheadline,
  ctaText,
  ctaAction,
  features = [],
  backgroundImage,
  stats = [],
  businessInfo,
  theme
}: HeroSectionProps) {
  const styles = variantStyles[variant];

  return (
    <section className={cn(
      "relative min-h-screen flex items-center justify-center overflow-hidden",
      styles.bg
    )}>
      {/* Background Image with Overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img 
            src={backgroundImage} 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            {/* Emergency Badge for Plumber */}
            {variant === 'plumber' && businessInfo.openingHours && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <Badge className={cn("text-sm font-semibold px-4 py-2", styles.badge)}>
                  <Clock className="w-4 h-4 mr-2" />
                  {businessInfo.openingHours}
                </Badge>
              </motion.div>
            )}

            {/* Rating for Restaurant/Medical */}
            {(variant === 'restaurant' || variant === 'medical') && businessInfo.rating && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 flex items-center gap-2"
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "w-5 h-5",
                        i < businessInfo.rating! ? "text-yellow-400 fill-current" : "text-gray-400"
                      )} 
                    />
                  ))}
                </div>
                <span className={cn("text-sm font-medium", styles.text)}>
                  {businessInfo.rating}/5 ({businessInfo.reviewsCount} avis)
                </span>
              </motion.div>
            )}

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6",
                styles.text
              )}
            >
              {headline}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={cn(
                "text-xl md:text-2xl mb-8 opacity-90 leading-relaxed",
                styles.text
              )}
            >
              {subheadline}
            </motion.p>

            {/* Features List */}
            {features.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8 space-y-3"
              >
                {features.map((feature, index) => (
                  <li key={index} className={cn("flex items-center text-lg", styles.text)}>
                    <div className="w-2 h-2 bg-current rounded-full mr-4 opacity-80" />
                    {feature}
                  </li>
                ))}
              </motion.ul>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={ctaAction}
                size="lg"
                className={cn(
                  "text-white font-semibold px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200",
                  styles.accent
                )}
              >
                <Phone className="w-5 h-5 mr-2" />
                {ctaText}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  "border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 font-semibold px-8 py-4 text-lg transition-all duration-200",
                  styles.text
                )}
              >
                Devis gratuit
              </Button>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 text-sm opacity-80"
            >
              <div className={cn("flex items-center", styles.text)}>
                <Phone className="w-4 h-4 mr-2" />
                {businessInfo.phone}
              </div>
              <div className={cn("flex items-center", styles.text)}>
                <MapPin className="w-4 h-4 mr-2" />
                {businessInfo.city}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Stats or Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            {stats.length > 0 ? (
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
                  >
                    <div className={cn("text-3xl font-bold mb-2", styles.text)}>
                      {stat.value}
                    </div>
                    <div className={cn("text-sm opacity-80", styles.text)}>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="relative">
                <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 flex items-center justify-center">
                  <div className={cn("text-6xl opacity-20", styles.text)}>
                    {variant === 'plumber' && '🔧'}
                    {variant === 'restaurant' && '🍽️'}
                    {variant === 'medical' && '⚕️'}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}