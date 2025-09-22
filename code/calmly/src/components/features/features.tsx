// src/components/features/features.tsx
import { FeaturesCarousel } from "@/components/features/features-carousel";
import { FeaturesTabs } from "@/components/features/features-tabs";
import { Badge } from "@/components/ui/badge";
// Import new, relevant icons from lucide-react
import { Bot, ClipboardCheck, CalendarCheck, Users } from "lucide-react";

export type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string; // We will use new image paths
};

// --- Updated Features for the Mental Health Platform ---
const features = [
  {
    icon: <Bot size={130} />,
    title: "AI-Guided Support",
    description: "Get immediate, 24/7 guidance for coping strategies and grounding exercises from our friendly AI.",
    image: "/features/ai-chat.png",
  },
  {
    icon: <ClipboardCheck size={20} />,
    title: "Confidential Screening",
    description: "Use clinically validated tests like PHQ-9 and GAD-7 to understand your mental state, privately and securely.",
    image: "/features/screening-test.png",
  },
  {
    icon: <CalendarCheck size={20} />,
    title: "Secure Counsellor Booking",
    description: "Easily find and book a confidential appointment with a qualified on-campus counsellor that fits your schedule.",
    image: "/features/booking-system.png",
  },
  {
    icon: <Users size={20} />,
    title: "Anonymous Peer Forum",
    description: "Connect with fellow students in a moderated, safe space. Share experiences and support each other anonymously.",
    image: "/features/peer-forum.png",
  },
] satisfies Feature[];

export function Features() {
  return (
    <div id="features" className="flex w-full flex-col items-center gap-6 px-6 py-14 md:px-10 md:py-25">
      <Badge variant="secondary" className="uppercase">
        Features
      </Badge>
      <h2 className="text-center text-3xl leading-[1.1] font-medium tracking-tight sm:text-5xl">
        A Complete Toolkit for
        <div className="text-muted-foreground">Your Mental Well-being</div>
      </h2>
      <p className="mb-3 max-w-lg text-center leading-6 tracking-tight sm:text-xl lg:mb-8">
        From immediate AI support to confidential booking with professionals, we provide the tools you need to feel heard and supported.
      </p>
      <FeaturesCarousel features={features} className="block lg:hidden" />
      <FeaturesTabs features={features} className="hidden lg:block" />
    </div>
  );
}
