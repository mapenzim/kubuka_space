import { ArrowBigRightDashIcon, CalendarCheck, ChartBarIcon, ColumnsIcon, PanelRightCloseIcon, PhoneCallIcon, PlayCircleIcon, ShieldAlert, ShieldCheckIcon, StoreIcon, TicketIcon } from "lucide-react";

export const solutions = [
  {
    name: 'Analytics',
    description: 'Get a better understanding of where your traffic is coming from.',
    href: '#',
    icon: ChartBarIcon,
  },
  {
    name: 'Engagement',
    description: 'Speak directly to your customers in a more meaningful way.',
    href: '#',
    icon: ArrowBigRightDashIcon,
  },
  { name: 'Security', description: "Your customers' data will be safe and secure.", href: '#', icon: ShieldAlert },
  {
    name: 'Integrations',
    description: "Connect with third-party tools that you're already using.",
    href: '#',
    icon: ColumnsIcon,
  },
  {
    name: 'Automations',
    description: 'Build strategic funnels that will drive your customers to convert',
    href: '#',
    icon: PanelRightCloseIcon,
  },
];

export const callsToAction = [
  { name: 'Watch Demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact Sales', href: '#', icon: PhoneCallIcon },
];

export const resources = [
  {
    name: 'Membership Center',
    description: 'Join our membership to enjoy more benefits',
    href: '/membership',
    icon: TicketIcon,
  },
  {
    name: 'Products on offer',
    description: 'Check out products on offer.',
    href: '/store',
    icon: StoreIcon,
  },
  {
    name: 'Events',
    description: 'See what meet-ups and other events we might be planning near you.',
    href: '#',
    icon: CalendarCheck,
  },
  { name: 'Security', description: 'Understand how we take your privacy seriously.', href: '#', icon: ShieldCheckIcon },
];

export const recentPosts = [
  { id: 1, name: 'Reading makes us wiser than we were before', href: '/blog/reading-makes-us-wiser-than-we-were-before' },
  { id: 2, name: 'How to use search engine optimization to drive traffic to your site', href: '#' },
  { id: 3, name: 'Improve your customer experience', href: '#' },
];

export const storeItems = [
  {
    plan: 'personal',
    packages: [
      'source code', 'call-in help', 'installtion'
    ],
    price: '150'
  },
  {
    plan: 'business',
    packages: [
      'source code', 'call-in help', 'installtion', 'tutorial', 'one year support', 'code samples', 'dependency upgrades', 'personalized authentication strategy'
    ],
    price: '960'
  },
  {
    plan: 'starter',
    packages: [
      'source code', 'call-in help', 'installtion', 'tutorial', 'six months support'
    ],
    price: '260'
  }
];