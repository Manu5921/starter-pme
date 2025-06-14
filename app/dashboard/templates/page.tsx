import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, ChefHat, Stethoscope, Eye } from "lucide-react";

export default async function TemplatesPage() {
  const result = await auth.api.getSession({
    headers: await headers(),
  });

  if (!result?.session?.userId) {
    redirect("/sign-in");
  }

  const templates = [
    {
      id: "plumber",
      name: "Plumber Template",
      description: "Professional template for plumbing services with emergency call features",
      icon: Wrench,
      color: "blue",
      features: [
        "Emergency contact section",
        "Service area map",
        "Service pricing grid",
        "Customer testimonials",
        "24/7 availability banner"
      ],
      usedCount: 5,
      lastUsed: "2024-01-20"
    },
    {
      id: "restaurant",
      name: "Restaurant Template", 
      description: "Elegant template for restaurants with menu showcase and reservation system",
      icon: ChefHat,
      color: "amber",
      features: [
        "Menu showcase",
        "Photo gallery",
        "Opening hours",
        "Reservation contact",
        "Location map"
      ],
      usedCount: 2,
      lastUsed: "2024-01-18"
    },
    {
      id: "medical",
      name: "Medical Template",
      description: "Clean and professional template for healthcare professionals",
      icon: Stethoscope,
      color: "green",
      features: [
        "Services overview",
        "Doctor profiles",
        "Appointment booking",
        "Contact information",
        "Professional certifications"
      ],
      usedCount: 0,
      lastUsed: null
    }
  ];

  return (
    <section className="flex flex-col items-start justify-start p-6 w-full">
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Templates
            </h1>
            <p className="text-muted-foreground">
              Ready-to-use website templates for different business types
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const IconComponent = template.icon;
            return (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${template.color}-100 dark:bg-${template.color}-900/20`}>
                        <IconComponent className={`h-6 w-6 text-${template.color}-600 dark:text-${template.color}-400`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {template.usedCount} sites
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Includes:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {template.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-current rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" className="flex-1">
                        Use Template
                      </Button>
                    </div>
                    
                    {template.lastUsed && (
                      <p className="text-xs text-muted-foreground">
                        Last used: {template.lastUsed}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}