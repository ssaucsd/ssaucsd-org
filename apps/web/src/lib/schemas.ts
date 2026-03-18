const BASE_URL = "https://ssaucsd.org";
const ORGANIZATION_ID = `${BASE_URL}/#organization`;
const ORGANIZATION_NAME = "Symphonic Student Association at UCSD";
const ORGANIZATION_DESCRIPTION =
  "Symphonic Student Association at UCSD is a student-run classical music club at UC San Diego connecting musicians, ensembles, rehearsals, concerts, and community events.";
const ORGANIZATION_LOGO = `${BASE_URL}/favicon/android-chrome-512x512.png`;
const ORGANIZATION_SAME_AS = [
  "https://github.com/ssaucsd",
  "https://www.instagram.com/ssa_at_ucsd",
  "https://linkedin.com/company/symphonic-student-association",
  "http://www.youtube.com/@symphonicstudentassociatio8977",
  "https://discord.gg/PncDrAxvkS",
];

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function generateOrganizationSchema({
  mainEntityOfPage,
}: { mainEntityOfPage?: string } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: ORGANIZATION_NAME,
    alternateName: ["SSA at UCSD", "SSA", "Symphonic Student Association"],
    url: BASE_URL,
    logo: ORGANIZATION_LOGO,
    sameAs: ORGANIZATION_SAME_AS,
    email: "mailto:symphoni@ucsd.edu",
    foundingDate: "2018",
    description: ORGANIZATION_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressLocality: "La Jolla",
      addressRegion: "CA",
      postalCode: "92093",
      addressCountry: "US",
    },
    ...(mainEntityOfPage ? { mainEntityOfPage } : {}),
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: ORGANIZATION_NAME,
    url: BASE_URL,
    description: ORGANIZATION_DESCRIPTION,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function generateSiteNavigationSchema() {
  const navItems = [
    { name: "Home", url: BASE_URL },
    { name: "About Us", url: `${BASE_URL}/about` },
    { name: "Events", url: `${BASE_URL}/events` },
  ];

  return navItems.map((item, index) => ({
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "@id": `${BASE_URL}/#nav-${index}`,
    name: item.name,
    url: item.url,
  }));
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.href && index < items.length - 1
        ? { item: `${BASE_URL}${item.href}` }
        : {}),
    })),
  };
}

export function generateFAQSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

export function generateEventSchema(event: {
  title: string;
  start_time: string;
  end_time: string;
  location: string;
  description?: string | null;
  image_url?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event.title,
    startDate: event.start_time,
    endDate: event.end_time,
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "La Jolla",
        addressRegion: "CA",
        addressCountry: "US",
      },
    },
    ...(event.image_url && { image: event.image_url }),
    ...(event.description && { description: event.description }),
    organizer: {
      "@id": ORGANIZATION_ID,
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      url: BASE_URL,
    },
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  };
}
