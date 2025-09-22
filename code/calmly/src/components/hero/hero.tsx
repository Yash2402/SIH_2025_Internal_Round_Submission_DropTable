import { BackgroundBlur } from "@/components/ui/background-blur";
import { Button } from "@/components/ui/button";
import { Pill, PillAvatar, PillAvatarGroup } from "@/components/ui/pill";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <div className="z-1 grid w-full place-items-center">
      <BackgroundBlur className="-top-40 md:-top-0" />
      <div className="mt-8 flex flex-col items-center gap-6">
        <Pill>
          <PillAvatarGroup className="hidden sm:flex">
            <PillAvatar src="/avatars/1.jpg" />
            <PillAvatar src="/avatars/2.jpg" />
            <PillAvatar src="/avatars/3.jpg" />
            <PillAvatar src="/avatars/4.jpg" />
          </PillAvatarGroup>
          <p className="text-muted-foreground px-2 text-xs font-medium sm:border-l-1 sm:text-sm">
            A safe space for <span className="text-foreground">students</span> just like you
          </p>
        </Pill>
        <h1 className="text-center text-4xl leading-[1.1] font-medium tracking-tight sm:text-7xl">
          Your Mental Wellness<span className="text-muted-foreground block">Starts Here.</span>
        </h1>
        <p className="max-w-lg text-center leading-6 tracking-tight sm:text-xl">
          Confidential support, self-help tools, and professional guidance, all in one place.
        </p>
        <Button className="mb-10 w-fit bg-black text-white hover:invert rounded-full hover:scale-[0.98]" size="lg" asChild>
          <Link href="/self-assessment">Take a Self-Assessment</Link>
        </Button>
        <Image src="/app-image-2.jpg" className="rounded-2xl" alt="Hero" width={760} height={445} />
      </div>
    </div>
  );
}
