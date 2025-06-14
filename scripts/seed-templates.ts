#!/usr/bin/env tsx

import { db } from "../db/drizzle";
import { templates } from "../db/schema";
import { eq } from "drizzle-orm";

const defaultTemplates = [
  {
    id: "plumber-template",
    name: "Plumber Template",
    type: "plumber",
    description: "Professional template for plumbing services with emergency call features",
    version: "1.0.0",
    config: {
      defaultColors: {
        primary: "blue-600",
        secondary: "gray-800",
        accent: "orange-500"
      },
      sections: [
        "hero",
        "services", 
        "service-area",
        "process",
        "testimonials",
        "faq",
        "contact",
        "footer"
      ],
      defaultContent: {
        hero: {
          headline: "Votre Plombier de Confiance",
          subheadline: "Intervention rapide 24h/24 - Devis gratuit",
          cta: "Appeler maintenant"
        },
        services: [
          {
            icon: "Wrench",
            title: "Dépannage Urgent",
            description: "Fuite d'eau, canalisation bouchée, panne chaudière",
            price: "À partir de 80€",
            highlighted: true
          },
          {
            icon: "Droplets",
            title: "Installation Sanitaire", 
            description: "WC, lavabo, douche, baignoire",
            price: "Devis gratuit"
          },
          {
            icon: "Thermometer",
            title: "Chauffage",
            description: "Installation et maintenance chaudière",
            price: "Sur mesure"
          }
        ]
      }
    },
    features: [
      "Emergency contact section",
      "Service area map",
      "Service pricing grid",
      "Customer testimonials", 
      "24/7 availability banner"
    ],
    previewImage: "/templates/plumber/preview.jpg",
    isActive: true,
    usageCount: 0
  },
  {
    id: "restaurant-template",
    name: "Restaurant Template",
    type: "restaurant", 
    description: "Elegant template for restaurants with menu showcase and reservation system",
    version: "1.0.0",
    config: {
      defaultColors: {
        primary: "amber-600",
        secondary: "stone-800",
        accent: "red-600"
      },
      sections: [
        "hero",
        "about",
        "menu",
        "gallery", 
        "reservation",
        "testimonials",
        "location",
        "footer"
      ],
      defaultContent: {
        hero: {
          headline: "Bienvenue au Restaurant",
          subheadline: "Une cuisine authentique et savoureuse",
          cta: "Réserver une table"
        },
        menu: [
          {
            category: "Entrées",
            items: [
              {
                name: "Salade de saison",
                description: "Salade fraîche aux légumes du marché",
                price: "12€"
              }
            ]
          }
        ]
      }
    },
    features: [
      "Menu showcase",
      "Photo gallery",
      "Opening hours",
      "Reservation contact",
      "Location map"
    ],
    previewImage: "/templates/restaurant/preview.jpg",
    isActive: true,
    usageCount: 0
  },
  {
    id: "medical-template", 
    name: "Medical Template",
    type: "medical",
    description: "Clean and professional template for healthcare professionals",
    version: "1.0.0",
    config: {
      defaultColors: {
        primary: "green-600",
        secondary: "gray-800",
        accent: "blue-500"
      },
      sections: [
        "hero",
        "services",
        "team",
        "appointment",
        "info",
        "testimonials",
        "contact", 
        "footer"
      ],
      defaultContent: {
        hero: {
          headline: "Votre Santé, Notre Priorité",
          subheadline: "Des soins de qualité dans un environnement bienveillant",
          cta: "Prendre rendez-vous"
        },
        services: [
          {
            icon: "Stethoscope",
            title: "Consultation Générale",
            description: "Examen complet et suivi médical personnalisé"
          },
          {
            icon: "Heart",
            title: "Cardiologie",
            description: "Dépistage et suivi des maladies cardiovasculaires"
          }
        ]
      }
    },
    features: [
      "Services overview",
      "Doctor profiles",
      "Appointment booking", 
      "Contact information",
      "Professional certifications"
    ],
    previewImage: "/templates/medical/preview.jpg",
    isActive: true,
    usageCount: 0
  }
];

async function seedTemplates() {
  console.log("🌱 Seeding templates...");

  try {
    for (const template of defaultTemplates) {
      // Check if template already exists
      const existing = await db
        .select()
        .from(templates)
        .where(eq(templates.id, template.id))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(templates).values({
          ...template,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✅ Created template: ${template.name}`);
      } else {
        console.log(`⏭️  Template already exists: ${template.name}`);
      }
    }

    console.log("🎉 Templates seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding templates:", error);
    process.exit(1);
  }
}

// Run the seeding
seedTemplates().then(() => {
  console.log("✨ All done!");
  process.exit(0);
}).catch((error) => {
  console.error("💥 Seeding failed:", error);
  process.exit(1);
});