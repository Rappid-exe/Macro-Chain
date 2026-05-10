"use client";

/**
 * Hosts the landing page's contact modal and wires it to the global
 * `window.openContactModal()` hook the original Vite App.tsx exposed.
 * Kept as a small bridge component so the landing page module can stay
 * a server component — only this island ships client JS for the modal.
 */

import { useEffect, useState } from "react";
import { ContactModal } from "@/landing/components/contact-modal";

declare global {
  interface Window {
    openContactModal?: () => void;
  }
}

export function LandingContactBridge() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.openContactModal = () => setOpen(true);
    return () => {
      delete window.openContactModal;
    };
  }, []);

  return <ContactModal open={open} onClose={() => setOpen(false)} />;
}
