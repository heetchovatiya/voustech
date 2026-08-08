/**
 * Single source of truth for every value that isn't in the content spec yet.
 * Swap these before launch — nothing here is fetched from an external source.
 */
export const siteConfig = {
  name: "VousTech",
  // TODO: replace with the production domain once registered.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://voustech.com",

  // TODO: replace with the real WhatsApp Business number (E.164, digits only, no "+").
  whatsappNumber: "243900000000",

  // TODO: replace with real profile URLs.
  social: {
    linkedin: "https://linkedin.com/company/voustech",
    facebook: "https://facebook.com/voustech",
    instagram: "https://instagram.com/voustech",
    x: "https://x.com/voustech",
  },

  // Inbox that receives contact-form leads (override with CONTACT_INBOX_EMAIL).
  contactInboxEmail: process.env.CONTACT_INBOX_EMAIL ?? "info@voustech.com",
  // TODO: this must be a verified sending domain/address in your Resend account.
  contactFromEmail:
    process.env.CONTACT_FROM_EMAIL ?? "no-reply@voustech.com",

  businessHours: {
    weekdays: "Mon–Fri 8:00 AM–6:00 PM (CAT)",
    saturday: "Sat 9:00 AM–1:00 PM",
    sunday: "Sun Closed",
  },
} as const;
