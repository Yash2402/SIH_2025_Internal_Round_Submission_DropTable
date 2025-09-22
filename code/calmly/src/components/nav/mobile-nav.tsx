"use client";
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  items: {
    label: string;
    href: string;
  }[];
  className?: string;
};

export function MobileNav({ items, className }: Props) {
  const { data: session } = useSession();

  return (
    <nav className={cn("flex w-full max-w-7xl items-center justify-between gap-4", className)}>
      <Link href="/">
        <Image src="/logo.png" alt="MindWell Logo" width={100} height={25} />
      </Link>
      <div className="flex items-center gap-2">
        {session && (
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
        )}
        <Drawer direction="top">
          <DrawerTrigger className="relative -m-2 cursor-pointer p-2">
            <span className="sr-only">Open menu</span>
            <Menu className="h-6 w-6" />
          </DrawerTrigger>
          <DrawerContent className="flex flex-col gap-4 p-8">
            <DrawerTitle className="sr-only">Menu</DrawerTitle>
            {items.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <hr className="my-2" />
            {!session ? (
              <Link href="/sign-in">Sign In</Link>
            ) : (
              <>
                <Link href="/dashboard-redirect">My Dashboard</Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="cursor-pointer text-left text-red-600">
                  Sign Out
                </button>
              </>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
}
