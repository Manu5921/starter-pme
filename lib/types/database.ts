import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { 
  clients, 
  sites, 
  siteAnalytics, 
  payments, 
  templates, 
  supportTickets 
} from "@/db/schema";

// Client types
export type Client = InferSelectModel<typeof clients>;
export type NewClient = InferInsertModel<typeof clients>;

// Site types  
export type Site = InferSelectModel<typeof sites>;
export type NewSite = InferInsertModel<typeof sites>;

// Analytics types
export type SiteAnalytics = InferSelectModel<typeof siteAnalytics>;
export type NewSiteAnalytics = InferInsertModel<typeof siteAnalytics>;

// Payment types
export type Payment = InferSelectModel<typeof payments>;
export type NewPayment = InferInsertModel<typeof payments>;

// Template types
export type Template = InferSelectModel<typeof templates>;
export type NewTemplate = InferInsertModel<typeof templates>;

// Support ticket types
export type SupportTicket = InferSelectModel<typeof supportTickets>;
export type NewSupportTicket = InferInsertModel<typeof supportTickets>;

// Business configuration types
export interface BusinessInfo {
  name: string;
  logo?: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  openingHours: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
    emergency?: string;
  };
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  price?: string;
  highlighted?: boolean;
}

export interface Testimonial {
  name: string;
  text: string;
  rating: number;
  city?: string;
  image?: string;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  cta: string;
  backgroundImage?: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

// Complete client configuration
export interface ClientConfig {
  id: string;
  template: 'plumber' | 'restaurant' | 'medical';
  domain: string;
  business: BusinessInfo;
  seo: SEOConfig;
  content: {
    hero: HeroContent;
    services: ServiceItem[];
    testimonials?: Testimonial[];
    faq?: Array<{
      question: string;
      answer: string;
    }>;
    gallery?: Array<{
      src: string;
      alt: string;
      caption?: string;
    }>;
  };
  theme: ThemeConfig;
}

// Template variants
export type TemplateType = 'plumber' | 'restaurant' | 'medical';

export type ClientStatus = 'development' | 'live' | 'suspended';
export type SiteStatus = 'building' | 'ready' | 'error' | 'maintenance';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentType = 'setup' | 'monthly' | 'annual';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Dashboard statistics
export interface DashboardStats {
  totalRevenue: number;
  activeSites: number;
  totalClients: number;
  templatesUsed: number;
  monthlyGrowth: number;
  averageSatisfaction: number;
}

// Site performance metrics
export interface SitePerformance {
  speed: number;
  seo: number;
  accessibility: number;
  uptime: number;
  lastChecked: Date;
}

// Analytics summary
export interface AnalyticsSummary {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{
    path: string;
    views: number;
  }>;
  referrers: Array<{
    source: string;
    visits: number;
  }>;
}