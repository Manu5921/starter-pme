"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  ArrowLeft, 
  Wrench, 
  ChefHat, 
  Stethoscope, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  Rocket,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const newClientSchema = z.object({
  businessName: z.string().min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
  contactName: z.string().min(2, "Le nom du contact doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  templateType: z.enum(["plumber", "restaurant", "medical"]),
  address: z.object({
    street: z.string().min(5, "Adresse incomplète"),
    city: z.string().min(2, "Ville requise"),
    postalCode: z.string().min(5, "Code postal invalide"),
  }),
  customizations: z.object({
    headline: z.string().optional(),
    subheadline: z.string().optional(),
  }).optional(),
  deployImmediately: z.boolean().optional()
});

type NewClientFormData = z.infer<typeof newClientSchema>;

export default function NewClientPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<any>(null);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<NewClientFormData>({
    resolver: zodResolver(newClientSchema)
  });

  const watchedTemplate = watch("templateType");

  const templates = [
    {
      id: "plumber",
      name: "Plombier",
      description: "Template professionnel pour services de plomberie avec urgences 24h/24",
      icon: Wrench,
      color: "blue",
      features: ["CTA urgence", "Zone intervention", "Témoignages", "FAQ"],
      estimatedTime: "5-10 min",
      available: true
    },
    {
      id: "restaurant", 
      name: "Restaurant",
      description: "Template élégant pour restaurants avec menu et réservations",
      icon: ChefHat,
      color: "amber",
      features: ["Menu showcase", "Galerie photos", "Réservations", "Horaires"],
      estimatedTime: "10-15 min",
      available: false
    },
    {
      id: "medical",
      name: "Médical",
      description: "Template professionnel pour cabinets médicaux et praticiens",
      icon: Stethoscope,
      color: "green", 
      features: ["Services médicaux", "Équipe", "Rendez-vous", "Certifications"],
      estimatedTime: "10-15 min",
      available: false
    }
  ];

  const onSubmit = async (data: NewClientFormData) => {
    setIsGenerating(true);
    
    try {
      console.log("Génération du site pour:", data.businessName);
      
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erreur lors de la génération");
      }

      setGenerationResult(result);
      setStep(3);
      
    } catch (error) {
      console.error("Erreur génération:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setValue("templateType", templateId as any);
    setStep(2);
  };

  const handleDeploy = async () => {
    if (!generationResult?.data?.client?.id) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: generationResult.data.client.id,
          forceRedeploy: false
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erreur lors du déploiement");
      }

      // Rediriger vers la page du client
      router.push(`/dashboard/clients`);
      
    } catch (error) {
      console.error("Erreur déploiement:", error);
      alert(error instanceof Error ? error.message : "Erreur lors du déploiement");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Créer un nouveau site client
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Générez un site professionnel en quelques minutes
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { number: 1, title: "Template", active: step >= 1 },
              { number: 2, title: "Informations", active: step >= 2 },
              { number: 3, title: "Génération", active: step >= 3 }
            ].map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
                  stepItem.active 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-600"
                )}>
                  {stepItem.number}
                </div>
                <span className={cn(
                  "ml-2 text-sm font-medium",
                  stepItem.active ? "text-blue-600" : "text-gray-500"
                )}>
                  {stepItem.title}
                </span>
                {index < 2 && (
                  <div className={cn(
                    "w-16 h-0.5 ml-4",
                    step > stepItem.number ? "bg-blue-600" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Template Selection */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choisissez un template
              </h2>
              <p className="text-gray-600">
                Sélectionnez le template qui correspond le mieux à l'activité de votre client
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((template) => {
                const IconComponent = template.icon;
                return (
                  <Card 
                    key={template.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-lg relative",
                      selectedTemplate === template.id && "ring-2 ring-blue-500",
                      !template.available && "opacity-60"
                    )}
                    onClick={() => template.available && handleTemplateSelect(template.id)}
                  >
                    {!template.available && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary">Bientôt</Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                        template.color === "blue" && "bg-blue-100 text-blue-600",
                        template.color === "amber" && "bg-amber-100 text-amber-600",
                        template.color === "green" && "bg-green-100 text-green-600"
                      )}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      <CardTitle className="text-xl">{template.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Inclus :</h4>
                          <ul className="space-y-1">
                            {template.features.map((feature, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center">
                                <div className="w-1.5 h-1.5 bg-current rounded-full mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {template.estimatedTime}
                          </span>
                          {template.available && (
                            <Button size="sm">
                              Choisir
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 2: Client Information Form */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Informations du client
              </h2>
              <p className="text-gray-600">
                Renseignez les informations de votre client pour personnaliser son site
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Business Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations de l'entreprise</CardTitle>
                  <CardDescription>
                    Détails de base sur l'activité de votre client
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">Nom de l'entreprise *</Label>
                      <Input
                        id="businessName"
                        {...register("businessName")}
                        placeholder="Ex: Plomberie Dubois"
                      />
                      {errors.businessName && (
                        <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="contactName">Nom du contact *</Label>
                      <Input
                        id="contactName"
                        {...register("contactName")}
                        placeholder="Ex: Jean Dubois"
                      />
                      {errors.contactName && (
                        <p className="text-red-500 text-sm mt-1">{errors.contactName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="contact@dubois-plomberie.fr"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        placeholder="06 12 34 56 78"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Adresse</CardTitle>
                  <CardDescription>
                    Localisation pour le référencement local
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="street">Adresse *</Label>
                    <Input
                      id="street"
                      {...register("address.street")}
                      placeholder="123 rue de la République"
                    />
                    {errors.address?.street && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.street.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ville *</Label>
                      <Input
                        id="city"
                        {...register("address.city")}
                        placeholder="Lyon"
                      />
                      {errors.address?.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.address.city.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="postalCode">Code postal *</Label>
                      <Input
                        id="postalCode"
                        {...register("address.postalCode")}
                        placeholder="69001"
                      />
                      {errors.address?.postalCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.address.postalCode.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customizations */}
              <Card>
                <CardHeader>
                  <CardTitle>Personnalisation (optionnel)</CardTitle>
                  <CardDescription>
                    Personnalisez les messages principaux du site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="headline">Titre principal</Label>
                    <Input
                      id="headline"
                      {...register("customizations.headline")}
                      placeholder="Ex: Votre Plombier de Confiance à Lyon"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subheadline">Sous-titre</Label>
                    <Textarea
                      id="subheadline"
                      {...register("customizations.subheadline")}
                      placeholder="Ex: Intervention rapide 24h/24 - Devis gratuit"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Deployment Option */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="deployImmediately"
                      {...register("deployImmediately")}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="deployImmediately" className="text-sm">
                      Déployer automatiquement sur Vercel après génération
                    </Label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Si décoché, vous pourrez déployer manuellement depuis le dashboard
                  </p>
                </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Retour
                </Button>
                
                <Button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Générer le site
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 3: Generation Result */}
        {step === 3 && generationResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Site généré avec succès !
              </h2>
              <p className="text-gray-600">
                Le site pour {generationResult.data.client.businessName} a été créé
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Nom de l'entreprise:</span>
                    <span>{generationResult.data.client.businessName}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Domaine suggéré:</span>
                    <span className="font-mono text-sm">{generationResult.data.domain}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Template:</span>
                    <Badge variant="outline">{generationResult.data.config.template}</Badge>
                  </div>

                  {generationResult.data.deployment ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center text-green-800">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">Site déployé automatiquement</span>
                      </div>
                      <p className="text-green-700 text-sm mt-1">
                        URL: <a href={generationResult.data.deployment.url} target="_blank" rel="noopener noreferrer" className="underline">
                          {generationResult.data.deployment.url}
                        </a>
                      </p>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center text-blue-800">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">Prêt pour le déploiement</span>
                      </div>
                      <p className="text-blue-700 text-sm mt-1">
                        Le site est généré et peut être déployé manuellement
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/clients")}
                className="flex-1"
              >
                Voir tous les clients
              </Button>
              
              {!generationResult.data.deployment && (
                <Button
                  onClick={handleDeploy}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Déploiement...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Déployer maintenant
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}