export interface IdeaTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  idea: string;
  suggestedTechStack: string;
}

export const IDEA_TEMPLATES: IdeaTemplate[] = [
  {
    id: 'saas-analytics',
    name: 'SaaS Analytics Dashboard',
    category: 'SaaS',
    description: 'A B2B analytics platform for tracking business metrics',
    idea: `A SaaS analytics dashboard that helps small businesses track their key metrics in one place. Users can connect their tools (Stripe, Google Analytics, social media) and see real-time dashboards with insights. Features include customizable widgets, automated weekly reports via email, goal tracking, and team collaboration. The platform should be easy to set up with no technical knowledge required.`,
    suggestedTechStack: 'Next.js, PostgreSQL, Redis, Stripe',
  },
  {
    id: 'mobile-fitness',
    name: 'Fitness Tracking App',
    category: 'Mobile App',
    description: 'A mobile app for workout tracking and progress',
    idea: `A fitness tracking mobile app that helps users build consistent workout habits. Users can log workouts (strength training, cardio, flexibility), track progress with charts, set goals, and follow guided workout programs. Key features include workout timer, exercise library with videos, rest day reminders, social features to workout with friends, and Apple Health/Google Fit integration.`,
    suggestedTechStack: 'React Native, Node.js, MongoDB',
  },
  {
    id: 'marketplace',
    name: 'Niche Marketplace',
    category: 'Marketplace',
    description: 'A two-sided marketplace for buyers and sellers',
    idea: `A marketplace platform connecting local artisans with buyers looking for handmade goods. Sellers can create shops, list products with photos and descriptions, and manage orders. Buyers can browse by category, save favorites, and checkout securely. Features include seller verification, review system, messaging between buyers/sellers, and commission-based revenue model.`,
    suggestedTechStack: 'Next.js, PostgreSQL, Stripe Connect, AWS S3',
  },
  {
    id: 'ai-writing',
    name: 'AI Writing Assistant',
    category: 'AI/ML',
    description: 'An AI-powered tool for content creation',
    idea: `An AI writing assistant that helps content creators produce blog posts, social media content, and marketing copy. Users input a topic or brief, and the AI generates drafts, suggests improvements, and helps with SEO optimization. Features include tone adjustment, plagiarism checking, content calendar, team workspaces, and integration with WordPress and social platforms.`,
    suggestedTechStack: 'Next.js, OpenAI API, PostgreSQL, Redis',
  },
  {
    id: 'community-platform',
    name: 'Community Platform',
    category: 'Social',
    description: 'A platform for building online communities',
    idea: `A community platform for creators and educators to build engaged audiences. Hosts can create spaces with discussion forums, live events, courses, and exclusive content. Members pay monthly subscriptions for access. Features include member profiles, direct messaging, content library, analytics dashboard, and integration with Zoom for live sessions.`,
    suggestedTechStack: 'Next.js, PostgreSQL, Stripe, WebSockets',
  },
  {
    id: 'booking-system',
    name: 'Appointment Booking',
    category: 'Productivity',
    description: 'A scheduling tool for service providers',
    idea: `An appointment booking system for service providers (consultants, therapists, salons). Providers set their availability, services, and pricing. Clients can book, reschedule, and pay online. Features include calendar sync (Google, Outlook), automated reminders via email/SMS, no-show protection with deposits, and a simple booking page that can be embedded on any website.`,
    suggestedTechStack: 'Next.js, PostgreSQL, Twilio, Stripe',
  },
  {
    id: 'project-management',
    name: 'Team Project Tracker',
    category: 'Productivity',
    description: 'A lightweight project management tool',
    idea: `A lightweight project management tool for small teams who find Jira too complex. Features include kanban boards, task assignments, due dates, file attachments, and team chat. The focus is on simplicity - no complex workflows or configurations. Includes integrations with Slack and GitHub, and a mobile app for on-the-go updates.`,
    suggestedTechStack: 'React, Node.js, PostgreSQL, Socket.io',
  },
  {
    id: 'learning-platform',
    name: 'Online Course Platform',
    category: 'EdTech',
    description: 'A platform for creating and selling courses',
    idea: `An online course platform where creators can build and sell educational content. Instructors create courses with video lessons, quizzes, and downloadable resources. Students track progress, earn certificates, and engage in discussion forums. Features include drip content, cohort-based courses, affiliate program, and white-label options for enterprise.`,
    suggestedTechStack: 'Next.js, PostgreSQL, Mux Video, Stripe',
  },
];

export const TEMPLATE_CATEGORIES = [...new Set(IDEA_TEMPLATES.map((t) => t.category))];
