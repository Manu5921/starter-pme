import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { clients } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

// Validation schema for creating a new client
const createClientSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  domain: z.string().optional(),
  templateType: z.enum(["plumber", "restaurant", "medical"]),
  config: z.object({
    business: z.object({
      name: z.string(),
      phone: z.string(),
      email: z.string(),
      address: z.object({
        street: z.string(),
        city: z.string(),
        postalCode: z.string(),
        country: z.string(),
      }),
      openingHours: z.object({}).optional(),
    }),
    seo: z.object({
      title: z.string(),
      description: z.string(),
      keywords: z.array(z.string()),
    }),
    content: z.object({
      hero: z.object({
        headline: z.string(),
        subheadline: z.string(),
        cta: z.string(),
      }),
      services: z.array(z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
        price: z.string().optional(),
        highlighted: z.boolean().optional(),
      })),
    }),
    theme: z.object({
      colors: z.object({
        primary: z.string(),
        secondary: z.string(),
        accent: z.string(),
      }),
    }),
  }),
  monthlyFee: z.number().optional().default(29),
});

// GET /api/clients - Get all clients for the authenticated user
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

    const allClients = await db
      .select()
      .from(clients)
      .where(eq(clients.userId, session.userId))
      .orderBy(desc(clients.createdAt));

    return NextResponse.json({
      success: true,
      data: allClients,
    });

  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

// POST /api/clients - Create a new client
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

    const body = await request.json();
    const validatedData = createClientSchema.parse(body);

    const clientId = nanoid();
    
    const [newClient] = await db
      .insert(clients)
      .values({
        id: clientId,
        ...validatedData,
        userId: session.userId,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newClient,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation error",
          details: error.errors 
        },
        { status: 400 }
      );
    }

    console.error("Error creating client:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create client" },
      { status: 500 }
    );
  }
}