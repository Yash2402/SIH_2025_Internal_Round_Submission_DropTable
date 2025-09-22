import { Wreath } from "@/components/showcase/wreath";
import { Bot, Shield, Languages } from "lucide-react";

export function Showcase() {
  return (
    <div className="relative mx-auto mt-12 mb-8 grid w-fit grid-cols-3 gap-8 md:my-24 md:gap-20">
      {/* Item 1: Focus on 24/7 AI Support */}
      <Wreath>
        <p className="mb-1 text-[0.625rem] md:text-base">Always Available</p>
        <div className="flex items-center text-primary-text [&>svg]:size-5 md:[&>svg]:size-8">
          <Bot />
        </div>
        <p className="mt-1.5 text-center text-xs font-bold md:text-xl">
          24/7 AI
          <br />
          Support
        </p>
      </Wreath>

      {/* Item 2: Focus on Confidentiality */}
      <Wreath>
        <p className="mb-1 text-[0.625rem] md:text-base">Stigma-Free</p>
        <div className="flex items-center text-primary-text [&>svg]:size-5 md:[&>svg]:size-8">
            <Shield />
        </div>
        <p className="mt-1.5 text-center text-xs font-bold md:text-xl">
          100%
          <br />
          Confidential
        </p>
      </Wreath>

      {/* Item 3: Focus on Regional Language Support */}
      <Wreath>
        <p className="mb-1 text-[0.625rem] md:text-base">Accessible</p>
        <div className="flex items-center text-primary-text [&>svg]:size-5 md:[&>svg]:size-8">
            <Languages />
        </div>
        <p className="mt-1.5 text-center text-xs font-bold md:text-xl">
          Regional
          <br />
          Languages
        </p>
      </Wreath>
    </div>
  );
}
