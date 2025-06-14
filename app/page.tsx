import FooterSection from "@/components/homepage/footer";
import HeroSection from "@/components/homepage/hero-section";
import Integrations from "@/components/homepage/integrations";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Integrations />
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">🚀 Website Builder Platform</h2>
        <p className="text-xl mb-8">Plateforme prête pour la production ✅</p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/demo">Voir le Template Plombier</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
      <FooterSection />
    </>
  );
}
