"use client";
import React, { useState } from "react";
import { Badge } from "@/components/Badge";
import { FeatureCard } from "@/components/FeatureCard";
import { IconSpark } from "@/components/icons/IconSpark";
import { IconLink } from "@/components/icons/IconLink";
import { IconTrack } from "@/components/icons/IconTrack";
import Link from "next/link";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Top border accent */}
      <div className="h-1 w-full bg-black" />

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-16">
        <div className="absolute inset-x-4 -z-10 top-10 rounded-3xl border border-black/10" />

        <div className="mx-auto grid max-w-4xl gap-8 text-center">
          <p className="mx-auto w-fit rounded-full border border-black/20 px-3 py-1 text-xs uppercase tracking-widest">Open source, organized</p>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Find projects. Rally contributors. <span className="underline decoration-black/20">Ship faster.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-base text-black/70 md:text-lg">
            Forged is a lightweight hub for maintainers and makers to post projects, match with contributors, and track progress—without the overhead.
          </p>

          <div className="mx-auto flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link 
              href="#waitlist"
              className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:translate-y-0.5 active:translate-y-1"
            >
              Join the waitlist
            </Link>
            <Link 
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-black px-6 py-3 text-sm font-semibold transition hover:bg-black hover:text-white"
            >
              Explore features
            </Link>
          </div>

          <div className="mx-auto mt-6 grid grid-cols-2 items-center gap-4 opacity-80 sm:grid-cols-4">
            <Badge>Zero-config setup</Badge>
            <Badge>Built for speed</Badge>
            <Badge>Privacy‑friendly</Badge>
            <Badge>Works with GitHub</Badge>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative mx-auto max-w-7xl px-4 py-20">
        {/* subtle frame to match hero */}
        <div className="absolute inset-x-4 -z-10 top-6 rounded-3xl border border-black/10" />

        <div className="mx-auto grid max-w-3xl place-items-center gap-3 text-center">
          <p className="mx-auto w-fit rounded-full border border-black/20 px-3 py-1 text-xs uppercase tracking-widest">Why Forged</p>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">Purpose-built to keep momentum</h2>
          <p className="text-black/70">
            Post crisp project cards, match with aligned contributors, and keep progress visible without bloated PM tools.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Post a project in minutes"
            desc="Create a skimmable card with goals, stack, and first issues. Ship the brief, not a novel."
            icon={<IconSpark />}
          />
          <FeatureCard
            title="Smart matching"
            desc="We surface contributors who fit your stack and availability. They see projects that match their skills."
            icon={<IconLink />}
          />
          <FeatureCard
            title="Lightweight tracking"
            desc="Milestones and updates in one clean view. Your repo stays the source of truth."
            icon={<IconTrack />}
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative mx-auto max-w-7xl px-4 py-20">
        {/* subtle frame to match hero */}
        <div className="absolute inset-x-4 -z-10 top-6 rounded-3xl border border-black/10" />

        <div className="mx-auto grid max-w-3xl place-items-center gap-3 text-center">
          <p className="mx-auto w-fit rounded-full border border-black/20 px-3 py-1 text-xs uppercase tracking-widest">How it works</p>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">Three simple steps</h2>
          <p className="text-black/70">From idea → team → shipped.</p>
        </div>

        <ol className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-3">
          <li className="rounded-3xl border border-black/15 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_8px_0_#000]">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black font-semibold">1</div>
            <div className="text-sm text-black/80">Publish your project card with goals, stack, and first issues.</div>
          </li>
          <li className="rounded-3xl border border-black/15 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_8px_0_#000]">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black font-semibold">2</div>
            <div className="text-sm text-black/80">We surface aligned contributors. You review and invite.</div>
          </li>
          <li className="rounded-3xl border border-black/15 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_8px_0_#000]">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black font-semibold">3</div>
            <div className="text-sm text-black/80">Track milestones, post updates, and celebrate releases.</div>
          </li>
        </ol>
      </section>

    </main>
  );
}

