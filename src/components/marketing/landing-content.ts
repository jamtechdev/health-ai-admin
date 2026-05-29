import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle2,
  Database,
  HeartPulse,
  LineChart,
  LockKeyhole,
  Mail,
  MapPin,
  PhoneCall,
  Shield,
  Smartphone,
  Target,
  UserCheck,
  Watch,
} from 'lucide-react';

export type IconCard = {
  icon: LucideIcon;
  label: string;
  value?: string;
};

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export const stats = [
  { label: 'Consumer profiles', value: '1,248', trend: '+12.4%' },
  { label: 'Health signals synced', value: '82k', trend: '24h' },
  { label: 'AI insights reviewed', value: '3.7k', trend: '+18%' },
];

export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Users', href: '#users' },
  { label: 'Platform', href: '#platform' },
  { label: 'About Us', href: '#about' },
  { label: 'Admin View', href: '#admin-view' },
  { label: 'Contact Us', href: '#contact' },
];

export const modules = [
  {
    icon: HeartPulse,
    title: 'Health Intelligence',
    description: 'Monitor sleep, activity, heart rate, HRV, subscriptions, and consumer health profiles from one command center.',
  },
  {
    icon: Brain,
    title: 'AI Insight Operations',
    description: 'Track generated insights, force refreshes, review model readiness, and keep recommendations accountable.',
  },
  {
    icon: Smartphone,
    title: 'Wearable Integrations',
    description: 'Manage Apple Health, Oura, Fitbit, Garmin, sync logs, failed retries, and connection status.',
  },
  {
    icon: Shield,
    title: 'Admin Governance',
    description: 'RBAC, audit trails, API logs, media controls, notifications, and secure workflows for every team.',
  },
];

export const userBenefits = [
  {
    icon: UserCheck,
    title: 'Personal health profile',
    description: 'Users can keep their goals, wellness context, and health timeline connected in one experience.',
  },
  {
    icon: Watch,
    title: 'Wearable-first tracking',
    description: 'Health signals from supported devices are prepared for dashboards, trends, and admin support workflows.',
  },
  {
    icon: Target,
    title: 'Actionable guidance',
    description: 'AI-ready insights help teams create clearer recommendations and more proactive user engagement.',
  },
];

export const workflow = [
  'Ingest biometric data from mobile and wearable sources',
  'Normalize health timelines for admins and care teams',
  'Generate AI-ready summaries and risk signals',
  'Act on users, roles, notifications, and compliance logs',
];

export const trustItems: IconCard[] = [
  { icon: LockKeyhole, label: 'Token-based sessions' },
  { icon: Database, label: 'PostgreSQL audit history' },
  { icon: AlertTriangle, label: 'Operational alerting' },
  { icon: CheckCircle2, label: 'API health monitoring' },
];

export const heroCards = [
  { label: 'Wearable sync', value: 'Running', icon: Activity },
  { label: 'AI readiness', value: 'Online', icon: Brain },
  { label: 'Audit stream', value: 'Tracked', icon: Shield },
  { label: 'Growth trend', value: '+12.4%', icon: LineChart },
];

export const adminLinks = [
  { label: 'Executive Dashboard', href: '/dashboard' },
  { label: 'Consumers & Health Data', href: '/consumers' },
  { label: 'AI Insights', href: '/insights' },
  { label: 'Wearable Monitoring', href: '/wearables' },
  { label: 'Subscriptions', href: '/subscriptions' },
  { label: 'Users, Roles & Audit', href: '/users' },
];

export const aboutHighlights = [
  'Consumer health oversight',
  'AI-assisted admin workflows',
  'Wearable sync reliability',
  'Security-first governance',
];

export const contactCards: IconCard[] = [
  { icon: Mail, label: 'Email', value: 'admin@tovapulse.com' },
  { icon: PhoneCall, label: 'Support', value: 'Admin operations desk' },
  { icon: MapPin, label: 'Coverage', value: 'Remote health-tech platform' },
];
