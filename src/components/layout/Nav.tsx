"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Pill } from "@/components/primitives/Pill";
import { navLinks, site } from "@/content/site";
import { cn } from "@/lib/cn";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-[250ms]",
        scrolled
          ? "border-b border-line bg-paper/85 text-ink shadow-soft backdrop-blur-2xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent text-paper"
      )}
    >
      <nav className="site-container flex h-20 items-center justify-between gap-6">
        <Link href="/#top" className="text-[17px] font-semibold tracking-[-0.01em]">
          Daniel Ghaly
          <sup className="ml-0.5 align-super text-[0.5em] text-accent">®</sup>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium transition-colors duration-200 hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Pill href={`mailto:${site.email}`} variant={scrolled ? "inverse" : "primary"}>
            Get in touch
          </Pill>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-current/20 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[-1] bg-ink px-6 pb-8 pt-28 text-paper md:hidden"
            initial={{ transform: "translateY(-100%)" }}
            animate={{ transform: "translateY(0%)" }}
            exit={{ transform: "translateY(-100%)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-full flex-col justify-between">
              <div className="flex flex-col gap-5">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="font-display text-[clamp(40px,12vw,72px)] font-semibold leading-none tracking-[-0.03em]"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <Pill href={`mailto:${site.email}`} variant="primary">
                Get in touch
              </Pill>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
