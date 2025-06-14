import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { templates } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// GET /api/templates - Get all available templates
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const allTemplates = await db
      .select()
      .from(templates)
      .where(eq(templates.isActive, true))
      .orderBy(desc(templates.usageCount));

    return NextResponse.json({
      success: true,
      data: allTemplates,
    });

  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

// POST /api/templates - Create default templates (admin only - for seeding)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Default templates configuration
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
          ]
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
          ]
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
          ]
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

    // Insert templates if they don't exist
    const insertedTemplates = [];
    for (const template of defaultTemplates) {
      try {
        const [inserted] = await db
          .insert(templates)
          .values({
            ...template,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .onConflictDoNothing()
          .returning();
        
        if (inserted) {
          insertedTemplates.push(inserted);
        }
      } catch (error) {
        console.log(`Template ${template.id} already exists or error occurred`);
      }
    }

    return NextResponse.json({
      success: true,
      data: insertedTemplates,
      message: `${insertedTemplates.length} templates created`,
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating templates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create templates" },
      { status: 500 }
    );
  }
}