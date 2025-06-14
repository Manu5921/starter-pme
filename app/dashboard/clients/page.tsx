import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Globe, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default async function ClientsPage() {
  const result = await auth.api.getSession({
    headers: await headers(),
  });

  if (!result?.session?.userId) {
    redirect("/sign-in");
  }

  // Mock data - will be replaced with database queries
  const clients = [
    {
      id: 1,
      businessName: "Plomberie Dubois",
      contactName: "Jean Dubois",
      email: "jean@dubois-plomberie.fr",
      phone: "06 12 34 56 78",
      template: "Plumber",
      status: "live",
      domain: "dubois-plomberie.fr",
      city: "Lyon",
      createdAt: "2024-01-15",
      monthlyFee: 29
    },
    {
      id: 2,
      businessName: "Restaurant Le Gourmet",
      contactName: "Marie Martin",
      email: "marie@legourmet.fr", 
      phone: "04 78 90 12 34",
      template: "Restaurant",
      status: "development",
      domain: "restaurant-legourmet.fr",
      city: "Paris",
      createdAt: "2024-01-20",
      monthlyFee: 29
    }
  ];

  return (
    <section className="flex flex-col items-start justify-start p-6 w-full">
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Clients
            </h1>
            <p className="text-muted-foreground">
              Manage your client websites and information
            </p>
          </div>
          <Link href="/dashboard/clients/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Client
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{client.businessName}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {client.city}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={client.status === 'live' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {client.status === 'live' ? (
                      <>
                        <Globe className="h-3 w-3 mr-1" />
                        Live
                      </>
                    ) : (
                      'Development'
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">{client.contactName}</p>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {client.phone}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{client.template}</Badge>
                    <span className="text-sm font-medium">€{client.monthlyFee}/mois</span>
                  </div>
                  
                  {client.status === 'live' && (
                    <Button variant="outline" size="sm" className="w-full">
                      <Globe className="h-4 w-4 mr-2" />
                      View Site
                    </Button>
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