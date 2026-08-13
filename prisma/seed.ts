import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { services as contentServices } from "../src/content/services";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create Default Admin User
  const defaultPassword = process.env.ADMIN_PASSWORD ?? "adminpassword123";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);
  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.CONTACT_INBOX_EMAIL ?? "info@voustech.com";

  await db.adminUser.upsert({
    where: { username: "admin" },
    update: { email: adminEmail, passwordHash },
    create: {
      username: "admin",
      email: adminEmail,
      passwordHash,
    },
  });
  console.log(`✅ Admin user seeded (Username: admin, Email: ${adminEmail})`);

  // 2. Initial Technologies
  const initialTechs = [
    { slug: "nextjs", name: "Next.js", category: "frontend", iconName: "code", description: "Fullstack React Framework for production web applications", displayOrder: 1, featured: true },
    { slug: "typescript", name: "TypeScript", category: "frontend", iconName: "code", description: "Typed JavaScript for scalable application development", displayOrder: 2, featured: true },
    { slug: "react", name: "React", category: "frontend", iconName: "code", description: "UI library for building dynamic interfaces", displayOrder: 3, featured: true },
    { slug: "tailwindcss", name: "Tailwind CSS", category: "frontend", iconName: "code", description: "Utility-first CSS framework for rapid UI design", displayOrder: 4, featured: true },
    { slug: "nodejs", name: "Node.js", category: "backend", iconName: "database", description: "Event-driven JavaScript runtime for backend services", displayOrder: 5, featured: true },
    { slug: "python", name: "Python / FastAPI", category: "backend", iconName: "database", description: "High-performance API and AI service backend framework", displayOrder: 6, featured: true },
    { slug: "postgresql", name: "PostgreSQL / SQLite", category: "cloud", iconName: "database", description: "Reliable relational data persistence with Prisma ORM", displayOrder: 7, featured: true },
    { slug: "react-native", name: "React Native", category: "mobile", iconName: "smartphone", description: "Cross-platform iOS and Android mobile app framework", displayOrder: 8, featured: true },
  ];

  for (const tech of initialTechs) {
    await db.technology.upsert({
      where: { slug: tech.slug },
      update: tech,
      create: tech,
    });
  }
  console.log(`✅ Seeded ${initialTechs.length} technologies`);

  // 3. Seed All 27 Services
  for (const s of contentServices) {
    await db.service.upsert({
      where: { slug: s.slug },
      update: {
        title: s.slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        category: s.category,
        summary: `Professional ${s.slug.replace(/-/g, " ")} solutions engineered for business growth.`,
        description: `Full lifecycle ${s.slug.replace(/-/g, " ")} service covering strategy, design, architecture, and ongoing support.`,
        deliverables: JSON.stringify(["Custom Architecture", "Security & SLA", "Dedicated Support"]),
        iconName: s.icon,
      },
      create: {
        slug: s.slug,
        title: s.slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        category: s.category,
        summary: `Professional ${s.slug.replace(/-/g, " ")} solutions engineered for business growth.`,
        description: `Full lifecycle ${s.slug.replace(/-/g, " ")} service covering strategy, design, architecture, and ongoing support.`,
        deliverables: JSON.stringify(["Custom Architecture", "Security & SLA", "Dedicated Support"]),
        iconName: s.icon,
      },
    });
  }
  console.log(`✅ Seeded all ${contentServices.length} services`);

  // 4. Initial Portfolio Projects
  const initialProjects = [
    {
      slug: "fintech-dashboard",
      title: "NexPay Financial Analytics Portal",
      category: "web-apps",
      summary: "Real-time payment dashboard processing $5M+ monthly transactions with multi-currency support.",
      description: "Designed and implemented a high-throughput financial analytics web portal for digital payment providers.",
      imageUrl: "/brand/voustech-light-bg.jpg",
      featured: true,
      tags: JSON.stringify(["Next.js", "TypeScript", "Tailwind CSS", "Prisma"]),
    },
    {
      slug: "healthtech-mobile-app",
      title: "CarePulse Telehealth Mobile App",
      category: "web-apps",
      summary: "HIPAA-compliant doctor consultation & appointment scheduling application for iOS and Android.",
      description: "Cross-platform mobile application featuring live video consultations, medical records storage, and instant prescription delivery.",
      imageUrl: "/brand/logo-lockup-dark.png",
      featured: true,
      tags: JSON.stringify(["React Native", "Node.js", "WebRTC", "PostgreSQL"]),
    },
    {
      slug: "ecommerce-b2b-platform",
      title: "Global Supply B2B Procurement Portal",
      category: "business-systems",
      summary: "B2B commerce engine managing 50,000+ inventory items with automated invoicing.",
      description: "Custom e-commerce infrastructure supporting wholesale pricing tiers, bulk orders, and automated ERP sync.",
      imageUrl: "/brand/logo-lockup-light.png",
      featured: true,
      tags: JSON.stringify(["Next.js", "Stripe API", "Zod", "Resend"]),
    },
  ];

  for (const p of initialProjects) {
    await db.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`✅ Seeded ${initialProjects.length} projects`);

  // 5. Initial Trusted Client Logos
  const initialLogos = [
    { name: "Rawbank", logoUrl: "/brand/logo-mark.png", websiteUrl: "https://rawbank.com", displayOrder: 1 },
    { name: "Vodacom", logoUrl: "/brand/logo-mark.png", websiteUrl: "https://vodacom.cd", displayOrder: 2 },
    { name: "Equity BCDC", logoUrl: "/brand/logo-mark.png", websiteUrl: "https://equitybcdc.cd", displayOrder: 3 },
    { name: "KaziCorp", logoUrl: "/brand/logo-mark.png", websiteUrl: "https://kazicorp.com", displayOrder: 4 },
    { name: "Afriland Bank", logoUrl: "/brand/logo-mark.png", websiteUrl: "https://afrilandfirstbank.com", displayOrder: 5 },
    { name: "Congo Tech Hub", logoUrl: "/brand/logo-mark.png", websiteUrl: "https://congotechhub.org", displayOrder: 6 },
  ];

  const existingLogosCount = await db.clientLogo.count();
  if (existingLogosCount === 0) {
    for (const logo of initialLogos) {
      await db.clientLogo.create({ data: logo });
    }
    console.log(`✅ Seeded ${initialLogos.length} trusted client logos`);
  }

  // 6. Initial Blog Posts
  const initialBlogs = [
    {
      slug: "mobile-first-design-matters",
      title: "Why Mobile-First Design Matters for Growing African Businesses",
      excerpt: "Mobile connectivity dominates internet usage across Africa. Learn why optimizing for mobile experience is essential.",
      content: "Mobile devices represent over 80% of internet traffic in emerging markets. Building lightweight, offline-resilient, and responsive digital products ensures your business reaches customers anywhere.",
      coverImage: "/brand/voustech-light-bg.jpg",
      author: "VousTech Team",
      published: true,
    },
    {
      slug: "signs-website-needs-security-audit",
      title: "5 Signs Your Business Website Needs an Immediate Security Audit",
      excerpt: "Outdated software, slow response times, and unencrypted forms leave your client data vulnerable.",
      content: "Cybersecurity threats affect businesses of all sizes. Regular security audits, HTTPS enforcement, and automated backups protect your digital reputation.",
      coverImage: "/brand/logo-lockup-dark.png",
      author: "VousTech Team",
      published: true,
    },
    {
      slug: "getting-started-with-business-automation",
      title: "Getting Started with Business Automation & AI Workflows",
      excerpt: "Eliminate repetitive tasks and save hundreds of operational hours with practical automation.",
      content: "From automated invoicing to instant lead routing, modern AI and script workflows allow teams to focus on strategy and client relationships.",
      coverImage: "/brand/logo-lockup-light.png",
      author: "VousTech Team",
      published: true,
    },
  ];

  for (const blog of initialBlogs) {
    await db.blogPost.upsert({
      where: { slug: blog.slug },
      update: blog,
      create: blog,
    });
  }
  console.log(`✅ Seeded ${initialBlogs.length} blog posts`);

  // 7. Initial Testimonials
  const initialTestimonials = [
    {
      clientName: "Jean-Marc Ilunga",
      clientRole: "Director",
      company: "Ilunga Trading Group",
      content: "VousTech redesigned our company website and, for the first time, we started receiving serious inquiries directly from the site. They understood our market from day one.",
      rating: 5,
    },
    {
      clientName: "Patrick Kabeya",
      clientRole: "Executive Director",
      company: "Espoir Congo Foundation",
      content: "Our old donor database was a spreadsheet. VousTech built us a proper system to track programs and donors, and trained our whole team to use it with confidence.",
      rating: 5,
    },
    {
      clientName: "Grace Mbayo",
      clientRole: "Founder",
      company: "PayEzi",
      content: "As a startup, we needed a technical partner who could move fast without cutting corners. VousTech built our MVP in weeks and it hasn't crashed once since launch.",
      rating: 5,
    },
    {
      clientName: "Aline Ngoyi",
      clientRole: "Operations Manager",
      company: "Marche Frais",
      content: "The online store VousTech built lets us take mobile payments directly, which changed how customers shop with us. Support has been responsive every time we've needed it.",
      rating: 5,
    },
  ];

  const testimonialCount = await db.testimonial.count();
  if (testimonialCount === 0) {
    for (const t of initialTestimonials) {
      await db.testimonial.create({ data: t });
    }
    console.log(`✅ Seeded ${initialTestimonials.length} client testimonials`);
  }

  // 8. Initial Company Metrics / Stats
  const initialMetrics = [
    { label: "Projects Delivered", value: "150", suffix: "+", displayOrder: 1 },
    { label: "Years of Experience", value: "8", suffix: "+", displayOrder: 2 },
    { label: "Happy Clients", value: "95", suffix: "%", displayOrder: 3 },
    { label: "Countries Served", value: "6", suffix: "", displayOrder: 4 },
    { label: "Support Availability", value: "24", suffix: "/7", displayOrder: 5 },
  ];

  const metricCount = await db.companyMetric.count();
  if (metricCount === 0) {
    for (const m of initialMetrics) {
      await db.companyMetric.create({ data: m });
    }
    console.log(`✅ Seeded ${initialMetrics.length} company metrics`);
  }

  // 9. Initial FAQs
  const initialFaqs = [
    {
      question: "What technology stack do you specialize in?",
      answer: "We specialize in modern web and mobile architecture including Next.js, React, TypeScript, Node.js, Python, Tailwind CSS, React Native, and cloud databases.",
      category: "general",
      displayOrder: 1,
      hidden: false,
    },
    {
      question: "How long does a typical custom website or web app project take?",
      answer: "Most custom website projects take 2–4 weeks, while complex enterprise web applications or mobile apps take 6–12 weeks depending on scope.",
      category: "general",
      displayOrder: 2,
      hidden: false,
    },
    {
      question: "Do you provide post-launch support and maintenance?",
      answer: "Yes, we provide ongoing maintenance, security updates, feature enhancements, and cloud infrastructure monitoring.",
      category: "general",
      displayOrder: 3,
      hidden: false,
    },
  ];

  const faqCount = await db.faq.count();
  if (faqCount === 0) {
    for (let i = 0; i < initialFaqs.length; i++) {
      await db.faq.create({ data: initialFaqs[i] });
    }
    console.log(`✅ Seeded ${initialFaqs.length} FAQs`);
  }

  console.log("✨ Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
