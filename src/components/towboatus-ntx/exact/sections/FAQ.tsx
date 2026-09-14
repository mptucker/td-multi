"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/towboatus-ntx/exact/icons";

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

const faqItems: FAQItem[] = [
  {
    question: "Who is Big Water Cowboys?",
    answer:
      "Big Water Cowboys, LLC operates three TowBoatUS franchises: TowBoatUS Lake Texoma, TowBoatUS Cedar Creek, and TowBoatUS Bois d'Arc. We're a team of highly trained, Coast Guard certified captains offering assistance towing to vessels in distress. We're also commercial divers and professional salvors with extensive experience recovering vessels of any size — from PWCs to houseboats — whether sinking, sunk, damaged, or wrecked.",
  },
  {
    question: "What is your service area?",
    answer:
      "We cover ALL of Lake Texoma, Bois d'Arc Lake, and Cedar Creek Reservoir with boats on the water ready to assist. We also travel to area lakes for salvage and recovery work. For large jobs or catastrophic events, our team can mobilize with equipment and deploy anywhere in the country for weeks or months at a time as needed.",
  },
  {
    question: "How much does a typical tow cost?",
    answer:
      "For BoatUS Freshwater or Saltwater members, towing, jump starts, fuel deliveries, soft ungroundings, and dock-to-dock service are included with your membership. For non-members, a typical tow costs between $300 and $600 depending on distance and conditions.",
  },
  {
    question: "What is BoatUS?",
    answer:
      "BoatUS is the nation's largest on-the-water towing fleet — think AAA for boats. With over 800,000 members and 325+ TowBoatUS ports, membership gets you 24/7 assistance on any boat you own, borrow, or rent, anywhere in the network.",
  },
  {
    question: "How do I become a BoatUS member?",
    answer:
      "Call us locally at (903) 361-8400 and we can sign you up over the phone. You can also sign up online through the BoatUS website. If you sign up online, we'd appreciate you using our code: WT13014I — it doesn't provide a discount, but it helps us out here locally.",
  },
  {
    question: "What memberships are offered?",
    answer:
      "BoatUS offers two memberships: Freshwater ($130/yr) covers inland lakes and rivers (excluding Florida) for towing, jump starts, fuel delivery, and soft ungroundings on any boat you own, borrow, or charter. Saltwater Unlimited ($215/yr) includes the same coverage plus offshore waters and all of Florida.",
  },
  {
    question: "What's a soft ungrounding?",
    answer:
      "A soft ungrounding is when we can use one boat to pull your vessel off of shore or a shoal area in 30 minutes or less. If we can't free you in that time, it becomes a salvage operation.",
  },
  {
    question: "What is salvage?",
    answer:
      "Salvage is a maritime term covering vessel distress scenarios beyond standard towing. It sounds scary, but it's really just a category for services that aren't simple tows — things like pump-outs (dewatering your boat), hard ungroundings, or wreck removal. When we go to salvage, we'll discuss it with you first and work out the best recovery plan. Our rates vary by service and severity — sometimes by-the-foot, sometimes time and materials. We're pros at salvage work and at working with insurance carriers to get the best outcome.",
  },
  {
    question: "What types of vessels can you salvage?",
    answer:
      "We recover vessels of all sizes — from PWCs and bass boats to cabin cruisers, houseboats, and commercial vessels. Our team has dive certifications, rigging expertise, and equipment relationships to handle complex recoveries including deep water operations, hazmat situations, and vessels in difficult access areas. We work directly with insurance companies on total loss claims and wreck removal.",
  },
  {
    question: "Do you travel for salvage work?",
    answer:
      "Yes. While our towing operations cover Lake Texoma, Cedar Creek, and Bois d'Arc, our salvage team travels nationwide. We've recovered vessels from lakes, rivers, and coastal waters across the country. When there's a catastrophic event or a large recovery job, we mobilize our equipment and crew and deploy wherever we're needed — for weeks or months at a time if that's what it takes.",
  },
  {
    question: "I have towing coverage through my insurance. Why do I need BoatUS?",
    answer:
      "Many insurance policies now include towing as an add-on, similar to roadside assistance for your car. However, a BoatUS membership ensures priority service from the nation's largest towing fleet with no out-of-pocket expense. Instead of paying upfront and submitting our invoice for reimbursement, you're simply covered.",
  },
  {
    question: "When does my BoatUS membership go into effect?",
    answer:
      "Your BoatUS Towing membership goes into effect at midnight the day of signup. Dock-to-dock coverage goes into effect 30 days after signup.",
  },
  {
    question: "How do I request a tow when I need help?",
    answer:
      "On our lakes, call us directly — Lake Texoma: (903) 465-2628, Cedar Creek: (903) 802-4488, Bois d'Arc: (903) 227-8880. You can also use the BoatUS App to request assistance from your phone. The national BoatUS dispatch line (1-800-391-4869) works 24/7 and will route to the nearest operator.",
  },
  {
    question: "Can someone else use my membership if they borrow my boat?",
    answer:
      "Yes. BoatUS membership follows the boat, not the operator. If a friend or family member is using your vessel and needs a tow, your membership covers the service. Coverage applies to any boat you own, borrow, or charter.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="bg-off-white py-14 lg:py-20 px-5 lg:px-8 border-t border-g300"
      aria-labelledby="faq-h2"
    >
      <div className="max-w-[900px] mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <div
            className="text-red text-[12px] tracking-[0.14em] uppercase mb-4 flex items-center justify-center gap-3"
            style={{ fontFamily: "var(--font-teko)" }}
          >
            <span className="w-6 h-[2px] bg-red" aria-hidden="true" />
            Questions &amp; Answers
            <span className="w-6 h-[2px] bg-red" aria-hidden="true" />
          </div>
          <h2
            id="faq-h2"
            className="text-[clamp(32px,7vw,48px)] uppercase leading-[0.95] tracking-[0.01em] text-navy mb-4"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-[15px] text-g500 leading-[1.6] max-w-[600px] mx-auto">
            Common questions about towing, salvage, and BoatUS membership options.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="flex flex-col gap-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-g300 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-g100/50 transition-colors"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span
                  className="text-[15px] sm:text-[16px] text-navy font-semibold leading-[1.4]"
                >
                  {item.question}
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-g500 shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              <div
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? "max-h-[500px]" : "max-h-0"
                }`}
              >
                <div className="px-5 pb-5 pt-0 text-[14px] sm:text-[15px] text-g600 leading-[1.7] border-t border-g200">
                  <div className="pt-4">{item.answer}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-[14px] text-g500 mb-4">
            Have a question not answered here? Need a salvage quote?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <a
              href="tel:+19034652628"
              className="inline-flex items-center justify-center gap-2 bg-red text-white no-underline text-[14px] font-semibold tracking-[0.02em] py-3 px-6 rounded transition-all hover:bg-red-dk"
            >
              Call Us: (903) 465-2628
            </a>
            <a
              href="https://www.boatus.com/faq/boat-towing"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 bg-navy text-white no-underline text-[14px] font-semibold tracking-[0.02em] py-3 px-6 rounded transition-all hover:bg-navy-deep"
            >
              BoatUS Membership FAQ →
            </a>
          </div>

          {/* App links */}
          <div className="pt-6 border-t border-g300">
            <p className="text-[13px] text-g500 mb-3">
              Download the BoatUS App to request assistance from your phone:
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://apps.apple.com/us/app/boatus/id382776882"
                target="_blank"
                rel="noopener"
                className="text-[13px] text-navy font-semibold hover:text-red transition-colors"
              >
                App Store (iPhone)
              </a>
              <span className="text-g400">|</span>
              <a
                href="https://play.google.com/store/apps/details?id=com.boatus.app"
                target="_blank"
                rel="noopener"
                className="text-[13px] text-navy font-semibold hover:text-red transition-colors"
              >
                Google Play (Android)
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
