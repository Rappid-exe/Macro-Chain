import { SIGNAL_ITEMS } from "@/lib/constants";
import { Marquee } from "@/components/marquee";
import { cn } from "@/lib/cn";

interface LiveSignalsMarqueeProps {
  className?: string;
}

/**
 * LiveSignalsMarquee renders two rows of signal items scrolling in opposite
 * directions (left-to-right and right-to-left). Uses the generic Marquee
 * component with SIGNAL_ITEMS from constants.
 */
export function LiveSignalsMarquee({ className }: LiveSignalsMarqueeProps) {
  const signalTexts = SIGNAL_ITEMS.map((item) => item.text);

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <Marquee
        items={signalTexts}
        direction="left"
        speed={30}
        pauseOnHover={true}
      />
      <Marquee
        items={signalTexts}
        direction="right"
        speed={35}
        pauseOnHover={true}
      />
    </div>
  );
}

export default LiveSignalsMarquee;
