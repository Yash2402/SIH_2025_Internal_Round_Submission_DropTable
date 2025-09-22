import { MobileNav } from "@/components/nav/mobile-nav";
import { DesktopNav } from "@/components/nav/desktop-nav";

// Updated nav items for the mental health app
const navItems = [
  {
    label: "Features",
    href: "/#features",
  },
  {
    label: "Resources",
    href: "/resources",
  },
  {
    label: "Forum",
    href: "/forum",
  },
];

export function Nav() {
  return (
    <div className="p-8">
      <MobileNav className="flex md:hidden" items={navItems} />
      <DesktopNav className="hidden md:flex" items={navItems} />
    </div>
  );
}
