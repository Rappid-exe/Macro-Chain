import { FAQ_ITEMS } from "@/landing/lib/constants";

export default function FAQSection() {
  return (
    <section aria-labelledby="faq-heading" className="py-16 px-4">
      <h2
        id="faq-heading"
        className="text-2xl font-semibold text-text-primary mb-8"
      >
        Frequently Asked Questions
      </h2>

      <dl className="space-y-6">
        {FAQ_ITEMS.map((item, index) => (
          <div key={index} className="border-b border-border pb-6 last:border-b-0">
            <dt className="font-semibold text-text-primary">{item.question}</dt>
            <dd className="font-normal text-base text-text-secondary pl-4 mt-2">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
