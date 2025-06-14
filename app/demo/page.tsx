import { PlumberTemplate } from "@/components/templates/plumber/PlumberTemplate";
import { duboisPlomberieConfig } from "@/lib/configs/examples/dubois-plomberie";

export default function DemoPage() {
  return (
    <div>
      <PlumberTemplate config={duboisPlomberieConfig} />
    </div>
  );
}

export const metadata = {
  title: "Démo Template Plombier - Website Builder Platform",
  description: "Démonstration du template plombier avec configuration complète",
  robots: "noindex, nofollow" // Ne pas indexer la démo
};