"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  MessageSquare,
  User,
  AlertCircle
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface ContactFormProps {
  variant: 'plumber' | 'restaurant' | 'medical';
  businessInfo: {
    name: string;
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
    };
    openingHours?: {
      monday?: string;
      tuesday?: string;
      wednesday?: string;
      thursday?: string;
      friday?: string;
      saturday?: string;
      sunday?: string;
      emergency?: string;
    };
  };
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
  urgency: z.enum(["low", "medium", "high", "emergency"]).optional(),
  preferredContact: z.enum(["phone", "email", "whatsapp"]).optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const variantStyles = {
  plumber: {
    bg: "bg-white",
    card: "bg-blue-50 border-blue-200",
    button: "bg-blue-600 hover:bg-blue-700",
    buttonSecondary: "bg-orange-500 hover:bg-orange-600",
    icon: "text-blue-600",
    iconBg: "bg-blue-100",
    title: "text-gray-900",
    description: "text-gray-600",
    input: "border-blue-200 focus:border-blue-500 focus:ring-blue-500",
    success: "bg-green-50 border-green-200 text-green-800"
  },
  restaurant: {
    bg: "bg-white",
    card: "bg-amber-50 border-amber-200", 
    button: "bg-amber-600 hover:bg-amber-700",
    buttonSecondary: "bg-red-600 hover:bg-red-700",
    icon: "text-amber-600",
    iconBg: "bg-amber-100",
    title: "text-gray-900",
    description: "text-gray-600",
    input: "border-amber-200 focus:border-amber-500 focus:ring-amber-500",
    success: "bg-green-50 border-green-200 text-green-800"
  },
  medical: {
    bg: "bg-white",
    card: "bg-green-50 border-green-200",
    button: "bg-green-600 hover:bg-green-700", 
    buttonSecondary: "bg-blue-500 hover:bg-blue-600",
    icon: "text-green-600",
    iconBg: "bg-green-100",
    title: "text-gray-900",
    description: "text-gray-600",
    input: "border-green-200 focus:border-green-500 focus:ring-green-500",
    success: "bg-green-50 border-green-200 text-green-800"
  }
};

export function ContactForm({
  variant,
  businessInfo,
  theme
}: ContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const styles = variantStyles[variant];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Form submitted:", data);
    setIsSubmitted(true);
    setIsSubmitting(false);
    reset();
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const urgencyOptions = [
    { value: "low", label: "Non urgent", color: "text-green-600" },
    { value: "medium", label: "Moyen", color: "text-yellow-600" },
    { value: "high", label: "Urgent", color: "text-orange-600" },
    { value: "emergency", label: "Urgence", color: "text-red-600" }
  ];

  const getSubjectPlaceholder = () => {
    switch (variant) {
      case 'plumber':
        return "Ex: Fuite d'eau dans la cuisine";
      case 'restaurant':
        return "Ex: Réservation pour 8 personnes";
      case 'medical':
        return "Ex: Consultation générale";
      default:
        return "Sujet de votre demande";
    }
  };

  const getMessagePlaceholder = () => {
    switch (variant) {
      case 'plumber':
        return "Décrivez votre problème de plomberie, l'urgence et votre adresse...";
      case 'restaurant':
        return "Précisez votre demande: réservation, événement, information...";
      case 'medical':
        return "Décrivez brièvement vos symptômes ou votre demande...";
      default:
        return "Votre message...";
    }
  };

  return (
    <section className={cn("py-20", styles.bg)} id="contact">
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
            Contactez-nous
          </h2>
          <p className={cn("text-lg md:text-xl max-w-3xl mx-auto", styles.description)}>
            {variant === 'plumber' && 'Une urgence ? Une question ? Nous sommes là pour vous aider 24h/24'}
            {variant === 'restaurant' && 'Réservation, information ou événement ? Contactez-nous facilement'}
            {variant === 'medical' && 'Prenez rendez-vous ou posez vos questions à notre équipe médicale'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className={cn("h-fit", styles.card)}>
              <CardHeader>
                <CardTitle className={cn("text-xl font-bold", styles.title)}>
                  Informations de contact
                </CardTitle>
                <CardDescription className={styles.description}>
                  Plusieurs moyens de nous joindre
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className={cn("p-3 rounded-xl", styles.iconBg)}>
                    <Phone className={cn("w-6 h-6", styles.icon)} />
                  </div>
                  <div>
                    <h4 className={cn("font-semibold mb-1", styles.title)}>Téléphone</h4>
                    <p className={cn("text-lg font-mono", styles.description)}>{businessInfo.phone}</p>
                    {variant === 'plumber' && businessInfo.openingHours?.emergency && (
                      <p className="text-sm text-orange-600 font-medium">
                        {businessInfo.openingHours.emergency}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className={cn("p-3 rounded-xl", styles.iconBg)}>
                    <Mail className={cn("w-6 h-6", styles.icon)} />
                  </div>
                  <div>
                    <h4 className={cn("font-semibold mb-1", styles.title)}>Email</h4>
                    <p className={styles.description}>{businessInfo.email}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className={cn("p-3 rounded-xl", styles.iconBg)}>
                    <MapPin className={cn("w-6 h-6", styles.icon)} />
                  </div>
                  <div>
                    <h4 className={cn("font-semibold mb-1", styles.title)}>Adresse</h4>
                    <p className={styles.description}>
                      {businessInfo.address.street}<br />
                      {businessInfo.address.postalCode} {businessInfo.address.city}
                    </p>
                  </div>
                </div>

                {/* Opening Hours */}
                {businessInfo.openingHours && (
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-xl", styles.iconBg)}>
                      <Clock className={cn("w-6 h-6", styles.icon)} />
                    </div>
                    <div>
                      <h4 className={cn("font-semibold mb-2", styles.title)}>Horaires</h4>
                      <div className="space-y-1 text-sm">
                        {Object.entries(businessInfo.openingHours).map(([day, hours]) => (
                          <div key={day} className={cn("flex justify-between", styles.description)}>
                            <span className="capitalize font-medium">{day}:</span>
                            <span>{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Emergency CTA for Plumber */}
                {variant === 'plumber' && (
                  <div className="pt-4 border-t border-blue-200">
                    <Button 
                      className={cn("w-full font-semibold", styles.buttonSecondary)}
                      size="lg"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Urgence 24h/24
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className={cn("text-xl font-bold", styles.title)}>
                  Envoyez-nous un message
                </CardTitle>
                <CardDescription className={styles.description}>
                  Nous vous répondrons dans les plus brefs délais
                </CardDescription>
              </CardHeader>
              <CardContent>
                
                {/* Success Message */}
                <AnimatePresence>
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={cn("p-4 rounded-xl border mb-6 flex items-center gap-3", styles.success)}
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Message envoyé avec succès!</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className={styles.title}>Nom complet *</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        className={cn("mt-1", styles.input)}
                        placeholder="Votre nom"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email" className={styles.title}>Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className={cn("mt-1", styles.input)}
                        placeholder="votre@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className={styles.title}>Téléphone *</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      className={cn("mt-1", styles.input)}
                      placeholder="06 12 34 56 78"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Urgency for Plumber */}
                  {variant === 'plumber' && (
                    <div>
                      <Label className={styles.title}>Urgence</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {urgencyOptions.map((option) => (
                          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value={option.value}
                              {...register("urgency")}
                              className="text-blue-600"
                            />
                            <span className={cn("text-sm", option.color)}>{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subject */}
                  <div>
                    <Label htmlFor="subject" className={styles.title}>Sujet *</Label>
                    <Input
                      id="subject"
                      {...register("subject")}
                      className={cn("mt-1", styles.input)}
                      placeholder={getSubjectPlaceholder()}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message" className={styles.title}>Message *</Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      className={cn("mt-1 min-h-[120px]", styles.input)}
                      placeholder={getMessagePlaceholder()}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn("w-full font-semibold", styles.button)}
                    size="lg"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}