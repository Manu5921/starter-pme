"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Wrench, 
  Droplets, 
  Thermometer, 
  Utensils, 
  Coffee, 
  Wine,
  Stethoscope,
  Heart,
  Activity,
  Phone,
  Euro
} from "lucide-react";

interface Service {
  icon: string;
  title: string;
  description: string;
  price?: string;
  highlighted?: boolean;
  features?: string[];
}

interface ServicesGridProps {
  services: Service[];
  variant: 'plumber' | 'restaurant' | 'medical';
  layout?: 'grid-2' | 'grid-3' | 'list';
  title?: string;
  subtitle?: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const iconMap = {
  // Plumber icons
  'Wrench': Wrench,
  'Droplets': Droplets,
  'Thermometer': Thermometer,
  // Restaurant icons
  'Utensils': Utensils,
  'Coffee': Coffee,
  'Wine': Wine,
  // Medical icons
  'Stethoscope': Stethoscope,
  'Heart': Heart,
  'Activity': Activity,
  // Common icons
  'Phone': Phone,
  'Euro': Euro,
};

const variantStyles = {
  plumber: {
    bg: "bg-gray-50",
    card: "bg-white border-blue-100 hover:border-blue-300 hover:shadow-blue-100/50",
    cardHighlighted: "bg-blue-50 border-blue-300 ring-2 ring-blue-200",
    icon: "text-blue-600",
    iconBg: "bg-blue-100",
    iconHighlighted: "text-orange-600 bg-orange-100",
    title: "text-gray-900",
    description: "text-gray-600",
    price: "text-blue-600",
    priceHighlighted: "text-orange-600",
    badge: "bg-orange-500 text-white"
  },
  restaurant: {
    bg: "bg-amber-50",
    card: "bg-white border-amber-100 hover:border-amber-300 hover:shadow-amber-100/50",
    cardHighlighted: "bg-amber-50 border-amber-300 ring-2 ring-amber-200",
    icon: "text-amber-600",
    iconBg: "bg-amber-100",
    iconHighlighted: "text-red-600 bg-red-100",
    title: "text-gray-900",
    description: "text-gray-600",
    price: "text-amber-600",
    priceHighlighted: "text-red-600",
    badge: "bg-red-600 text-white"
  },
  medical: {
    bg: "bg-green-50",
    card: "bg-white border-green-100 hover:border-green-300 hover:shadow-green-100/50",
    cardHighlighted: "bg-green-50 border-green-300 ring-2 ring-green-200",
    icon: "text-green-600",
    iconBg: "bg-green-100",
    iconHighlighted: "text-blue-600 bg-blue-100",
    title: "text-gray-900",
    description: "text-gray-600",
    price: "text-green-600",
    priceHighlighted: "text-blue-600",
    badge: "bg-blue-500 text-white"
  }
};

export function ServicesGrid({
  services,
  variant,
  layout = 'grid-3',
  title = "Nos Services",
  subtitle = "Des solutions professionnelles adaptées à vos besoins",
  theme
}: ServicesGridProps) {
  const styles = variantStyles[variant];
  
  const gridCols = {
    'grid-2': 'grid-cols-1 md:grid-cols-2',
    'grid-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    'list': 'grid-cols-1'
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent || Wrench;
  };

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
          <p className={cn("text-lg md:text-xl max-w-3xl mx-auto", styles.description)}>
            {subtitle}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className={cn("grid gap-8", gridCols[layout])}>
          {services.map((service, index) => {
            const IconComponent = getIcon(service.icon);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={cn(
                  "h-full transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl relative overflow-hidden",
                  service.highlighted ? styles.cardHighlighted : styles.card
                )}>
                  
                  {/* Highlighted Badge */}
                  {service.highlighted && (
                    <div className="absolute top-4 right-4">
                      <Badge className={styles.badge}>
                        Populaire
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    {/* Service Icon */}
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
                      service.highlighted ? styles.iconHighlighted : `${styles.iconBg} ${styles.icon}`
                    )}>
                      <IconComponent className="w-8 h-8" />
                    </div>

                    {/* Service Title */}
                    <CardTitle className={cn("text-xl font-bold", styles.title)}>
                      {service.title}
                    </CardTitle>

                    {/* Service Price */}
                    {service.price && (
                      <div className={cn(
                        "text-lg font-semibold",
                        service.highlighted ? styles.priceHighlighted : styles.price
                      )}>
                        {service.price}
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Service Description */}
                    <CardDescription className={cn("text-base mb-4", styles.description)}>
                      {service.description}
                    </CardDescription>

                    {/* Service Features */}
                    {service.features && service.features.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className={cn("flex items-center text-sm", styles.description)}>
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full mr-3",
                              service.highlighted ? styles.priceHighlighted : styles.price
                            )} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* CTA Button */}
                    <Button
                      variant={service.highlighted ? "default" : "outline"}
                      className={cn(
                        "w-full font-semibold transition-all duration-200",
                        service.highlighted 
                          ? styles.badge 
                          : `border-2 ${styles.icon} hover:bg-current hover:text-white`
                      )}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {variant === 'plumber' && 'Dépannage'}
                      {variant === 'restaurant' && 'Commander'}
                      {variant === 'medical' && 'Prendre RDV'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h3 className={cn("text-2xl font-bold mb-4", styles.title)}>
              {variant === 'plumber' && 'Besoin d\'une intervention d\'urgence ?'}
              {variant === 'restaurant' && 'Une question sur nos plats ?'}
              {variant === 'medical' && 'Besoin d\'un conseil médical ?'}
            </h3>
            <p className={cn("text-lg mb-6", styles.description)}>
              {variant === 'plumber' && 'Notre équipe est disponible 24h/24 pour tous vos dépannages'}
              {variant === 'restaurant' && 'Notre équipe est à votre disposition pour vous renseigner'}
              {variant === 'medical' && 'Nos praticiens sont disponibles pour répondre à vos questions'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className={cn("font-semibold", styles.badge)}>
                <Phone className="w-5 h-5 mr-2" />
                Appeler maintenant
              </Button>
              <Button variant="outline" size="lg" className={cn("font-semibold", styles.icon)}>
                Devis gratuit
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}