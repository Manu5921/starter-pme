import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, Settings, BarChart } from "lucide-react";

export default async function SitesPage() {
  const result = await auth.api.getSession({
    headers: await headers(),
  });

  if (!result?.session?.userId) {
    redirect("/sign-in");
  }

  // Mock data - will be replaced with database queries
  const sites = [
    {
      id: 1,
      businessName: "Plomberie Dubois",
      domain: "dubois-plomberie.fr",
      template: "Plumber",
      status: "live",
      deployedAt: "2024-01-15",
      lastUpdate: "2024-01-20",
      monthlyVisitors: 342,
      performance: {
        speed: 98,
        seo: 95,
        accessibility: 92
      }
    },
    {
      id: 2,
      businessName: "Restaurant Le Gourmet", 
      domain: "restaurant-legourmet.fr",
      template: "Restaurant",
      status: "development",
      deployedAt: null,
      lastUpdate: "2024-01-22",
      monthlyVisitors: 0,
      performance: {
        speed: 0,
        seo: 0,
        accessibility: 0
      }
    },
    {
      id: 3,
      businessName: "Cabinet Médical Santé+",
      domain: "cabinet-sante-plus.fr", 
      template: "Medical",
      status: "live",
      deployedAt: "2024-01-10",
      lastUpdate: "2024-01-18",
      monthlyVisitors: 156,
      performance: {
        speed: 96,
        seo: 98,
        accessibility: 94
      }
    }
  ];

  return (
    <section className="flex flex-col items-start justify-start p-6 w-full">
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Sites
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage all deployed client websites
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {sites.map((site) => (
            <Card key={site.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="text-xl">{site.businessName}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Globe className="h-4 w-4" />
                        {site.domain}
                      </CardDescription>
                    </div>
                    <Badge variant={site.status === 'live' ? 'default' : 'secondary'}>
                      {site.status === 'live' ? 'Live' : 'Development'}
                    </Badge>
                    <Badge variant="outline">{site.template}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {site.status === 'live' && (
                      <>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Site
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart className="h-4 w-4 mr-2" />
                          Analytics
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Status</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {site.deployedAt ? `Deployed: ${site.deployedAt}` : 'Not deployed'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Updated: {site.lastUpdate}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Traffic</h4>
                    <p className="text-2xl font-semibold">{site.monthlyVisitors}</p>
                    <p className="text-xs text-muted-foreground">Monthly visitors</p>
                  </div>
                  
                  {site.status === 'live' && (
                    <>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Performance</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Speed</span>
                            <span className="font-medium">{site.performance.speed}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>SEO</span>
                            <span className="font-medium">{site.performance.seo}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Accessibility</span>
                            <span className="font-medium">{site.performance.accessibility}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Health</h4>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600">All systems operational</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Last checked: 2 min ago</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}