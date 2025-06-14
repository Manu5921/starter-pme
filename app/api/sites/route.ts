import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { sites, clients } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

// Validation schema for creating a new site
const createSiteSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  domain: z.string().min(1, "Domain is required"),
});

// GET /api/sites - Get all sites for the authenticated user
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

    // Get sites with their associated client information
    const allSites = await db
      .select({
        site: sites,
        client: {
          id: clients.id,
          businessName: clients.businessName,
          templateType: clients.templateType,
          status: clients.status,
        }
      })
      .from(sites)
      .innerJoin(clients, eq(sites.clientId, clients.id))
      .where(eq(clients.userId, session.userId))
      .orderBy(desc(sites.createdAt));

    return NextResponse.json({
      success: true,
      data: allSites,
    });

  } catch (error) {
    console.error("Error fetching sites:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sites" },
      { status: 500 }
    );
  }
}

// POST /api/sites - Create a new site deployment
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
    const validatedData = createSiteSchema.parse(body);

    // Verify that the client belongs to the authenticated user
    const [client] = await db
      .select()
      .from(clients)
      .where(
        eq(clients.id, validatedData.clientId)
      )
      .limit(1);

    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    if (client.userId !== session.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access to client" },
        { status: 403 }
      );
    }

    const siteId = nanoid();
    
    const [newSite] = await db
      .insert(sites)
      .values({
        id: siteId,
        clientId: validatedData.clientId,
        domain: validatedData.domain,
        status: "building",
        lastBuildAt: new Date(),
        ssl: true,
      })
      .returning();

    // TODO: Trigger Vercel deployment here
    // This will be implemented in the deployment system

    return NextResponse.json({
      success: true,
      data: newSite,
      message: "Site deployment initiated",
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

    console.error("Error creating site:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create site" },
      { status: 500 }
    );
  }
}