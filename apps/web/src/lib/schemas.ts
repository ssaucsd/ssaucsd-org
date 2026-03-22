const BASE_URL = "https://ssaucsd.org";

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: "SSA at UCSD",
    url: BASE_URL,
    description:
      "University of California, San Diego's largest student-run classical music-oriented organization.",
    publisher: { "@id": `${BASE_URL}/#organization` },
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
      "@type": "Organization",
      name: "Symphonic Student Association at UCSD",
      url: BASE_URL,
    },
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  };
}
