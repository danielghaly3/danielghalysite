"use client";

import { Phone, Mail, Instagram, Linkedin } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { isExternalLink } from "@/lib/link";

const contactItems = [
  {
    label: "Phone",
    icon: Phone,
    href: "tel:+16475700334",
  },
  {
    label: "Email",
    icon: Mail,
    href: "mailto:danielghaly3@gmail.com",
  },
  {
    label: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/graphxify/",
  },
  {
    label: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/danielghalyx/",
  },
];

export function Contact() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section-pad bg-paper text-ink"
    >
      <div className="site-container text-center">
        <motion.h2
          id="contact-heading"
          className="section-title"
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, transform: "translateY(18px)" }
          }
          whileInView={{ opacity: 1, transform: "translateY(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: shouldReduceMotion ? 0.25 : 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Contact
        </motion.h2>

        <motion.p
          className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-ash"
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, transform: "translateY(12px)" }
          }
          whileInView={{ opacity: 1, transform: "translateY(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: shouldReduceMotion ? 0.25 : 0.6,
            delay: shouldReduceMotion ? 0 : 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Let&apos;s build something clean, modern, and useful together.
        </motion.p>

        <motion.div
          className="mx-auto mt-14 max-w-lg rounded-[24px] border border-white/10 bg-ink px-8 py-10 text-paper shadow-pop sm:px-12 sm:py-12"
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, transform: "translateY(20px)" }
          }
          whileInView={{ opacity: 1, transform: "translateY(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: shouldReduceMotion ? 0.25 : 0.65,
            delay: shouldReduceMotion ? 0 : 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
            {contactItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={isExternalLink(item.href) ? "_blank" : undefined}
                rel={isExternalLink(item.href) ? "noopener noreferrer" : undefined}
                className="group flex flex-col items-center gap-3"
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, transform: "translateY(10px)" }
                }
                whileInView={{ opacity: 1, transform: "translateY(0px)" }}
                viewport={{ once: true }}
                transition={{
                  duration: shouldReduceMotion ? 0.25 : 0.5,
                  delay: shouldReduceMotion ? 0 : 0.3 + index * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span className="grid h-14 w-14 place-items-center rounded-full border border-white/12 bg-white/[0.06] text-white/70 transition-all duration-300 group-hover:scale-110 group-hover:border-accent/60 group-hover:bg-accent group-hover:text-paper sm:h-16 sm:w-16">
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <span className="text-[13px] font-medium text-white/55 transition-colors duration-300 group-hover:text-paper">
                  {item.label}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
