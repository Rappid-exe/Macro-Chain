import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !query.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Contact Support</h2>
        <p className="text-white/50 text-sm mb-8">
          Have a question or need help? Send us a message and we will get back to you.
        </p>

        {submitted ? (
          <div className="text-center py-8">
            <p className="text-lg font-medium text-yellow-400 mb-2">
              Message sent
            </p>
            <p className="text-white/50 text-sm">
              We will get back to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-white/70 mb-1.5">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full min-h-11 rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-white/70 mb-1.5">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full min-h-11 rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30"
              />
            </div>

            <div>
              <label htmlFor="contact-query" className="block text-sm font-medium text-white/70 mb-1.5">
                Your query
              </label>
              <textarea
                id="contact-query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="How can we help?"
                rows={4}
                className="w-full rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30 resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <Button type="submit" variant="solid" size="lg" className="w-full">
              Send Message
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
