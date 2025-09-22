// src/components/footer/footer.tsx
import { FooterBlur } from "@/components/footer/footer-blur";
// We are no longer using social media icons, so this import can be removed.
// import { XIcon, LinkedInIcon, GithubIcon } from "@/components/footer/icons";
import Link from "next/link";

// --- New, Relevant Links for the Mental Health Platform ---
const links = [
  {
    title: "Platform",
    links: [
      {
        label: "Features",
        href: "/#features",
        title: "Explore our platform features",
      },
      {
        label: "Self-Assessment",
        href: "/self-assessment",
        title: "Take a confidential screening test",
      },
      {
        label: "Peer Forum",
        href: "/forum",
        title: "Visit the anonymous peer support forum",
      },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        label: "Resource Hub",
        href: "/resources",
        title: "Access articles, videos, and audio guides",
      },
      {
        label: "FAQs",
        href: "/#faqs",
        title: "Find answers to common questions",
      },
    ],
  },
  {
    title: "Get Help", // A crucial section for this type of app
    links: [
        {
            label: "Campus Counselling",
            href: "/booking", // Direct link to the booking page
            title: "Book an appointment with a campus counsellor",
        },
        {
            label: "Emergency Helpline",
            href: "tel:988", // Example: US Suicide & Crisis Lifeline. Update if needed for your region.
            title: "Call an emergency helpline immediately",
        },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative -mt-25 overflow-hidden py-12 pt-37 md:py-25 md:pt-37">
      <FooterBlur />
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 px-6 tracking-tight md:grid-cols-4">
        {links.map((link) => (
          <div key={link.title} className="mb-10 text-center md:text-left">
            <h3 className="text-muted-foreground mb-8">{link.title}</h3>
            <ul className="flex flex-col items-center md:items-start gap-8">
              {link.links.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    title={link.title}
                    target={link.href.startsWith("https://") || link.href.startsWith("tel:") ? "_blank" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
