import FeatureCard from "@/components/landing-page/feature-card";
import TitleSection from "@/components/landing-page/title-section";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { CLIENTS, COMPANIES, FEATURES } from "@/lib/constants";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { randomUUID } from "crypto";
import { index } from "drizzle-orm/mysql-core";
import { ArrowRight, Github, GithubIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function HomePage() {
  return (
    <>
      <section className="overflow-hidden px-4 sm:px-6 mt-10 sm:flex sm:flex-col gap-4 md:justify-center md:items-center">
        <TitleSection pill="Wazzup" title="Your workspaces, Evolve!" subheading="lorem ipsum kintum valkji haiok jsolw vango handp hajnIk nwolskoa hndlsa" />
        <div className="flex justify-start mt-6 gap-4">
          <Button
            variant="default"
            className="flex justify-center group items-center gap-2 hover:bg-background hover:border-primary border border-transparent transition-all hover:text-primary duration-200"
          >
            Get Started{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
          <Button
            variant="secondary"
            className="flex justify-center items-center gap-2"
          >
            <GitHubLogoIcon className="w-4 h-4" /> Source Code
          </Button>
        </div>
      </section>
      <section className="overflow-hidden px-4 sm:px-6 mt-10 flex flex-col w-fit mx-auto sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {FEATURES.map((feature, idx) => (
          <FeatureCard key={idx} title={feature.title} description={feature.description} className="filter" bgUrl={feature.bgUrl} />
        ))}
      </section>
      <section className="overflow-hidden px-4 sm:px-6 mt-20 flex flex-col">
        <TitleSection title="Everyone trust us!" subheading="Source? I made it up so it'll look good" />
        {[...Array(2)].map((arr, idx) => (
          <div key={randomUUID()} className={twMerge(
            clsx('mt-10 flex flex-nowrap gap-2 self-start', {
              'flex-row-reverse': idx === 1,
              'animate-[slide_250s_linear_infinite]': true,
              'animate-[slide_250s_linear_infinite_reverse]': idx === 1,
              'ml-[100vw]': idx === 1
            }),
            'hover:paused'
          )}>
            {CLIENTS.map((client, idx) => (
              <div key={idx} className="relative w-[200px] mx-16 shrink-0 flex items-center">
                <Image src={client.logo} alt={client.alt} width={200} className="object-contain max-w-none" />
              </div>
            ))}
          </div>
        ))}
      </section>
    </>
  );
}
