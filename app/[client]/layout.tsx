import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

interface ClientLayoutProps {
  children: ReactNode;
  params: {
    client: string;
  };
}

export default function ClientLayout({ children, params }: ClientLayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
      
      {/* Analytics pour tous les sites clients */}
      <Analytics />
      
      {/* Script de tracking personnalisé si nécessaire */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Analytics personnalisés pour ${params.client}
            if (typeof window !== 'undefined') {
              console.log('Site client: ${params.client}');
            }
          `
        }}
      />
    </div>
  );
}