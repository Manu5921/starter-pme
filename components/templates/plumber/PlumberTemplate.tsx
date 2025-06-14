"use client";

import { HeroSection } from "@/components/shared/HeroSection";
import { ServicesGrid } from "@/components/shared/ServicesGrid";
import { ContactForm } from "@/components/shared/ContactForm";
import { Testimonials } from "@/components/shared/Testimonials";
import { FAQ } from "@/components/shared/FAQ";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  MapPin, 
  Clock, 
  Shield, 
  Award, 
  Phone, 
  CheckCircle, 
  Users,
  Wrench,
  Droplets,
  Thermometer,
  Home,
  Star
} from "lucide-react";
import { ClientConfig } from "@/lib/types/database";

interface PlumberTemplateProps {
  config: ClientConfig;
}

export function PlumberTemplate({ config }: PlumberTemplateProps) {
  const theme = {
    primary: "blue-600",
    secondary: "gray-800", 
    accent: "orange-500"
  };

  // Default services if not provided
  const defaultServices = [
    {
      icon: "Wrench",
      title: "Dépannage Urgent",
      description: "Fuite d'eau, canalisation bouchée, panne chaudière - Intervention rapide 24h/24",
      price: "À partir de 80€",
      highlighted: true,
      features: [
        "Intervention en moins de 30 minutes",
        "Diagnostic gratuit",
        "Devis transparent",
        "Garantie 2 ans"
      ]
    },
    {
      icon: "Droplets",
      title: "Installation Sanitaire",
      description: "Installation et remplacement de WC, lavabo, douche, baignoire",
      price: "Devis gratuit",
      features: [
        "Matériel de qualité",
        "Installation conforme aux normes",
        "Conseil personnalisé",
        "SAV réactif"
      ]
    },
    {
      icon: "Thermometer", 
      title: "Chauffage & Climatisation",
      description: "Installation, maintenance et dépannage de chaudières et climatiseurs",
      price: "Sur mesure",
      features: [
        "Entretien annuel",
        "Réparation tous modèles",
        "Installation certifiée",
        "Conseils économies d'énergie"
      ]
    }
  ];

  // Default testimonials
  const defaultTestimonials = [
    {
      name: "Marie L.",
      text: "Intervention très rapide pour une fuite d'eau. Travail soigné et prix correct. Je recommande !",
      rating: 5,
      city: "Lyon 6ème",
      service: "Dépannage urgence"
    },
    {
      name: "Pierre M.",
      text: "Installation de ma nouvelle salle de bain parfaitement réalisée. Très professionnel.",
      rating: 5,
      city: "Villeurbanne",
      service: "Installation sanitaire"
    },
    {
      name: "Sophie D.",
      text: "Entretien chaudière effectué rapidement. Technicien compétent et sympa.",
      rating: 5,
      city: "Lyon 3ème", 
      service: "Chauffage"
    }
  ];

  // Default FAQ
  const defaultFAQ = [
    {
      question: "Intervenez-vous vraiment 24h/24 ?",
      answer: "Oui, nous sommes disponibles 24h/24 et 7j/7 pour toutes les urgences de plomberie. Nos techniciens peuvent intervenir en moins de 30 minutes sur Lyon et sa périphérie."
    },
    {
      question: "Vos devis sont-ils gratuits ?",
      answer: "Absolument ! Nous établissons tous nos devis gratuitement et sans engagement. Le devis est détaillé et transparent, avec aucun coût caché."
    },
    {
      question: "Quelles sont vos garanties ?",
      answer: "Nous offrons une garantie de 2 ans sur tous nos travaux et installations. De plus, nous utilisons uniquement des matériaux de qualité professionnelle."
    },
    {
      question: "Acceptez-vous les paiements par carte ?",
      answer: "Oui, nous acceptons tous les modes de paiement : espèces, chèque, carte bancaire et virement. Possibilité de paiement en plusieurs fois pour les gros travaux."
    },
    {
      question: "Êtes-vous assurés ?",
      answer: "Bien sûr ! Nous sommes totalement assurés et déclarés. Nous pouvons fournir nos attestations d'assurance sur demande."
    }
  ];

  const services = config.content.services || defaultServices;
  const testimonials = config.content.testimonials || defaultTestimonials;
  const faqs = config.content.faq || defaultFAQ;

  const handleCTAClick = () => {
    window.location.href = `tel:${config.business.phone}`;
  };

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <HeroSection
        variant="plumber"
        headline={config.content.hero.headline}
        subheadline={config.content.hero.subheadline}
        ctaText={config.content.hero.cta}
        ctaAction={handleCTAClick}
        features={[
          "Intervention en moins de 30 minutes",
          "Devis gratuit et transparent", 
          "Garantie 2 ans sur tous travaux"
        ]}
        stats={[
          { value: "500+", label: "Interventions" },
          { value: "24h/7j", label: "Disponibilité" },
          { value: "98%", label: "Satisfaction" },
          { value: "< 30min", label: "Délai moyen" }
        ]}
        businessInfo={{
          phone: config.business.phone,
          city: config.business.address.city,
          openingHours: "Urgences 24h/24 - 7j/7",
          rating: 5,
          reviewsCount: 127
        }}
        theme={theme}
      />

      {/* Service Area Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Zone d'intervention
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nous intervenons rapidement sur {config.business.address.city} et toute sa métropole
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Carte interactive</h3>
                  <p className="text-gray-600">Zone de {config.business.address.city} et périphérie (30km)</p>
                </div>
              </div>
            </motion.div>

            {/* Service Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">Délai d'intervention</h4>
                    <p className="text-blue-600 font-semibold">Moins de 30 minutes</p>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">Disponibilité</h4>
                    <p className="text-orange-600 font-semibold">24h/24 - 7j/7</p>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6 text-center">
                    <Award className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">Certification</h4>
                    <p className="text-green-600 font-semibold">RGE Qualifiée</p>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">Expérience</h4>
                    <p className="text-purple-600 font-semibold">15 ans</p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4">Villes desservies :</h4>
                <div className="flex flex-wrap gap-2">
                  {["Lyon", "Villeurbanne", "Caluire", "Bron", "Vénissieux", "Saint-Priest", "Meyzieu", "Décines"].map((city) => (
                    <Badge key={city} variant="outline" className="bg-white">
                      {city}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesGrid
        services={services}
        variant="plumber"
        title="Nos services de plomberie"
        subtitle="Des solutions complètes pour tous vos besoins en plomberie et chauffage"
        theme={theme}
      />

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Un processus simple et efficace pour résoudre tous vos problèmes de plomberie
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Appelez-nous",
                description: "Décrivez votre problème par téléphone. Nous évaluons l'urgence et planifions l'intervention.",
                icon: Phone
              },
              {
                step: "2", 
                title: "Intervention rapide",
                description: "Notre technicien arrive chez vous avec tout le matériel nécessaire pour résoudre le problème.",
                icon: Wrench
              },
              {
                step: "3",
                title: "Travail garanti",
                description: "Réparation effectuée selon les normes. Devis transparent et garantie 2 ans incluse.",
                icon: CheckCircle
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4"
              onClick={handleCTAClick}
            >
              <Phone className="w-5 h-5 mr-2" />
              Appelez maintenant : {config.business.phone}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials
        testimonials={testimonials}
        variant="plumber"
        title="Nos clients témoignent"
        subtitle="Découvrez pourquoi plus de 500 clients nous font confiance"
        theme={theme}
      />

      {/* FAQ Section */}
      <FAQ
        faqs={faqs}
        variant="plumber"
        title="Questions fréquentes"
        subtitle="Tout ce que vous devez savoir sur nos services de plomberie"
        theme={theme}
      />

      {/* Contact Section */}
      <ContactForm
        variant="plumber"
        businessInfo={{
          name: config.business.name,
          phone: config.business.phone,
          email: config.business.email,
          address: config.business.address,
          openingHours: config.business.openingHours
        }}
        theme={theme}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">{config.business.name}</h3>
              <p className="text-gray-300 mb-4">
                Votre expert en plomberie et chauffage sur {config.business.address.city}. 
                Intervention rapide 24h/24 pour tous vos dépannages urgents.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-300">4.9/5 sur 127 avis</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Dépannage urgence</li>
                <li>Installation sanitaire</li>
                <li>Chauffage</li>
                <li>Débouchage</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{config.business.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{config.business.address.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>24h/24 - 7j/7</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {config.business.name}. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}