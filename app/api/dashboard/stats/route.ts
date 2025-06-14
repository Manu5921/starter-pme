import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { clients, sites, payments, templates } from "@/db/schema";
import { eq, and, sum, count, gte, sql } from "drizzle-orm";

// GET /api/dashboard/stats - Get dashboard statistics
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

    // Get current date for calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get total revenue from paid payments
    const revenueResult = await db
      .select({
        total: sum(payments.amount)
      })
      .from(payments)
      .innerJoin(clients, eq(payments.clientId, clients.id))
      .where(
        and(
          eq(clients.userId, session.userId),
          eq(payments.status, "paid")
        )
      );

    const totalRevenue = revenueResult[0]?.total || 0;

    // Get revenue for current month
    const currentMonthRevenueResult = await db
      .select({
        total: sum(payments.amount)
      })
      .from(payments)
      .innerJoin(clients, eq(payments.clientId, clients.id))
      .where(
        and(
          eq(clients.userId, session.userId),
          eq(payments.status, "paid"),
          gte(payments.paidAt, startOfMonth)
        )
      );

    const currentMonthRevenue = currentMonthRevenueResult[0]?.total || 0;

    // Get revenue for last month
    const lastMonthRevenueResult = await db
      .select({
        total: sum(payments.amount)
      })
      .from(payments)
      .innerJoin(clients, eq(payments.clientId, clients.id))
      .where(
        and(
          eq(clients.userId, session.userId),
          eq(payments.status, "paid"),
          gte(payments.paidAt, lastMonth),
          sql`${payments.paidAt} < ${startOfMonth}`
        )
      );

    const lastMonthRevenue = lastMonthRevenueResult[0]?.total || 0;

    // Calculate revenue growth
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Get active sites count
    const activeSitesResult = await db
      .select({
        count: count()
      })
      .from(sites)
      .innerJoin(clients, eq(sites.clientId, clients.id))
      .where(
        and(
          eq(clients.userId, session.userId),
          eq(sites.status, "ready")
        )
      );

    const activeSites = activeSitesResult[0]?.count || 0;

    // Get total clients count
    const totalClientsResult = await db
      .select({
        count: count()
      })
      .from(clients)
      .where(eq(clients.userId, session.userId));

    const totalClients = totalClientsResult[0]?.count || 0;

    // Get active clients (with live status)
    const activeClientsResult = await db
      .select({
        count: count()
      })
      .from(clients)
      .where(
        and(
          eq(clients.userId, session.userId),
          eq(clients.status, "live")
        )
      );

    const activeClients = activeClientsResult[0]?.count || 0;

    // Get template usage
    const templateUsageResult = await db
      .select({
        templateType: clients.templateType,
        count: count()
      })
      .from(clients)
      .where(eq(clients.userId, session.userId))
      .groupBy(clients.templateType);

    const templatesUsed = templateUsageResult.length;
    const mostPopularTemplate = templateUsageResult.reduce((prev, current) => 
      (prev.count > current.count) ? prev : current
    )?.templateType || "plumber";

    // Calculate uptime (mock data for now - will be real monitoring later)
    const uptime = 99.9;

    // Calculate average satisfaction (mock data for now)
    const averageSatisfaction = 95;

    const stats = {
      totalRevenue: Math.round(totalRevenue / 100), // Convert from cents to euros
      currentMonthRevenue: Math.round(currentMonthRevenue / 100),
      revenueGrowth: Math.round(revenueGrowth * 10) / 10, // Round to 1 decimal
      activeSites,
      totalClients,
      activeClients,
      templatesUsed,
      mostPopularTemplate,
      uptime,
      averageSatisfaction,
      templateUsage: templateUsageResult.map(t => ({
        template: t.templateType,
        count: t.count
      }))
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}