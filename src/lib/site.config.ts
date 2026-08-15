/**
 * Single source of truth for every value that isn't in the content spec yet.
 * Swap these before launch — nothing here is fetched from an external source.
 */
export const siteConfig = {
  name: "VousTech",
  // TODO: replace with the production domain once registered.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.voustech.com",

  // TODO: replace with the real WhatsApp Business number (E.164, digits only, no "+").
  whatsappNumber: "918141140052",

  // TODO: replace with real profile URLs.
  social: {
    linkedin: "https://linkedin.com/company/voustech",
    facebook: "https://facebook.com/voustech",
    instagram: "https://instagram.com/voustech",
    x: "https://x.com/voustech",
  },

  // Inbox that receives contact-form leads (override with CONTACT_INBOX_EMAIL).
  contactInboxEmail: process.env.CONTACT_INBOX_EMAIL ?? "info@voustech.com",
  // Sender address for Resend. Default to onboarding@resend.dev for test mode (override with CONTACT_FROM_EMAIL once domain is verified).
  contactFromEmail:
    process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",

  businessHours: {
    weekdays: "Mon–Fri 8:00 AM–6:00 PM (CAT)",
    saturday: "Sat 9:00 AM–1:00 PM",
    sunday: "Sun Closed",
  },
} as const;
