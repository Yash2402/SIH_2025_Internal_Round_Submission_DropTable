// src/components/faq/faq.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Helper components remain the same as they are for styling
function AccordionItemFAQs(props: React.ComponentProps<typeof AccordionItem>) {
  return (
    <AccordionItem
      {...props}
      className={cn(
        "bg-secondary/30 data-[state=open]:bg-card data-[state=open]:border-border rounded-lg border border-transparent px-5 py-2 transition-colors data-[state=open]:shadow-sm lg:px-7",
        props.className,
      )}
    />
  );
}

function AccordionTriggerFAQs(props: React.ComponentProps<typeof AccordionTrigger>) {
  return (
    <AccordionTrigger
      {...props}
      className={cn("[&[data-state=open]>svg]:text-foreground text-base lg:text-lg", props.className)}
    />
  );
}

function AccordionContentFAQs(props: React.ComponentProps<typeof AccordionContent>) {
  return <AccordionContent {...props} className={cn("text-muted-foreground lg:text-base", props.className)} />;
}


// Main component with updated content
export function FAQs() {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-6 py-14 md:grid-cols-2 md:gap-14 md:px-10 md:py-25">
      <div className="flex w-full flex-col gap-6">
        <Badge variant="secondary" className="mb-2 uppercase">
          FAQ
        </Badge>
        <h2 className="text-3xl leading-[1.1] font-medium tracking-tight sm:text-5xl">
          Your Questions
          <br />
          <span className="text-muted-foreground">Answered</span>
        </h2>
        <p className="max-w-lg text-xs leading-6 tracking-tight sm:text-base">
          Find answers to common questions about privacy, services, and how our platform works.
        </p>
        <Button className="mb-10 w-fit bg-black text-white hover:invert rounded-full hover:scale-[0.98]" size="lg" asChild>
          <Link href="/screening">Take a Self-Assessment</Link>
        </Button>
      </div>
      <Accordion type="single" collapsible defaultValue="confidentiality" className="grid w-full gap-4">
        <AccordionItemFAQs value="confidentiality">
          <AccordionTriggerFAQs>Is my information kept confidential?</AccordionTriggerFAQs>
          <AccordionContentFAQs>
            <p>
              Absolutely. Your privacy is our top priority. All your interactions, including chat conversations and screening results, are confidential. The university only receives anonymized, aggregated data for trends, never your personal information.
            </p>
          </AccordionContentFAQs>
        </AccordionItemFAQs>
        <AccordionItemFAQs value="crisis">
          <AccordionTriggerFAQs>What if I need immediate help?</AccordionTriggerFAQs>
          <AccordionContentFAQs>
            <p>
              If you indicate you are in a crisis or at immediate risk, our system will instantly provide you with emergency contacts, including national helplines and on-campus emergency services. This platform is a supportive tool, not a substitute for emergency services.
            </p>
          </AccordionContentFAQs>
        </AccordionItemFAQs>
        <AccordionItemFAQs value="cost">
          <AccordionTriggerFAQs>Do I have to pay for this service?</AccordionTriggerFAQs>
          <AccordionContentFAQs>
            <p>
              No. This platform is provided to you completely free of charge through your institution. All features, from the AI chat to booking appointments with on-campus counsellors, are included.
            </p>
          </AccordionContentFAQs>
        </AccordionItemFAQs>
        <AccordionItemFAQs value="purpose">
          <AccordionTriggerFAQs>Is this app a replacement for therapy?</AccordionTriggerFAQs>
          <AccordionContentFAQs>
            <p>
              This platform is a mental health first-aid and support tool, not a replacement for professional therapy. It's designed to help you understand your feelings, learn coping strategies, and connect you with the right resources, including professional counsellors if needed.
            </p>
          </AccordionContentFAQs>
        </AccordionItemFAQs>
      </Accordion>
    </div>
  );
}
