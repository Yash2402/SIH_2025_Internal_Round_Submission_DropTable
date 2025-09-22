"use client";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  items: {
    label: string;
    href: string;
  }[];
  className?: string;
};

export function DesktopNav({ items, className }: Props) {
  const { data: session } = useSession();

  return (
    <nav className={cn("mx-auto flex max-w-6xl flex-row justify-center space-x-32", className)}>
      <Link href="/">
        <Image src="/logo.png" alt="Calmly Logo" width={110} height={28} />
      </Link>
      <NavigationMenu>
        <NavigationMenuList className="rounded-full bg-white">
          {items.map((item) => (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink href={item.href}>{item.label}</NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-4">
        {!session ? (
          <Button asChild className="rounded-full hover:scale-[0.98]">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        ) : (
          <>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/dashboard-redirect">My Dashboard</Link>
            </Button>
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-300"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                {session.user?.image ? (
                  <Image src={session.user.image} alt="User" width={32} height={32} className="rounded-full" />
                ) : (
                  <span className="text-sm font-semibold text-gray-600">
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
