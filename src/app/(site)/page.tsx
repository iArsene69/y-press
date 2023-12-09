import FeatureCard from "@/components/landing-page/feature-card";
import TitleSection from "@/components/landing-page/title-section";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CLIENTS, FEATURES, PRICING_CARDS } from "@/lib/constants";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { randomUUID } from "crypto";
import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function HomePage() {
  return (
    <>
      <section className="overflow-hidden px-4 sm:px-6 mt-10 sm:flex sm:flex-col gap-4 md:justify-center md:items-center">
        <TitleSection
          pill="Wazzup"
          title="Your workspaces, Evolve!"
          subheading="lorem ipsum kintum valkji haiok jsolw vango handp hajnIk nwolskoa hndlsa"
        />
        <div className="flex justify-start mt-6 gap-4">
          <Link href="/dashboard">
            <Button
              variant="default"
              className="flex justify-center group items-center gap-2 hover:bg-background hover:border-primary border border-transparent transition-all hover:text-primary duration-200"
            >
              Get Started{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
          <Link href="https://github.com/iArsene69/y-press">
            <Button
              variant="secondary"
              className="flex justify-center items-center gap-2"
            >
              <GitHubLogoIcon className="w-4 h-4" /> Source Code
            </Button>
          </Link>
        </div>
        <div className="md:mt-[90px] md:w-4/5 w-full flex justify-center items-center mt-[40px] relative">
          <AspectRatio ratio={2 / 1}>
            <Image
              src={"/img/banner.png"}
              alt="App Banner"
              fill
              className="rounded-xl mx-auto shadow-[0_0_200px_#939394]"
            />
          </AspectRatio>
        </div>
      </section>
      <section className="overflow-hidden h-full py-12 cards px-4 sm:px-6 mt-10 flex flex-col w-fit mx-auto sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {FEATURES.map((feature, idx) => (
          <FeatureCard
            key={idx}
            title={feature.title}
            description={feature.description}
            className="cursor-pointer card transition-all duration-300"
            bgUrl={feature.bgUrl}
          />
        ))}
      </section>
      <section className="overflow-hidden px-4 sm:px-6 mt-20 flex flex-col">
        <TitleSection
          title="Everyone trust us!"
          subheading="Source? I made it up so it'll look good"
        />
        {[...Array(2)].map((arr, idx) => (
          <div
            key={randomUUID()}
            className={twMerge(
              clsx("mt-10 flex flex-nowrap gap-2 self-start", {
                "flex-row-reverse": idx === 1,
                "animate-[slide_250s_linear_infinite]": true,
                "animate-[slide_250s_linear_infinite_reverse]": idx === 1,
                "ml-[100vw]": idx === 1,
              }),
              "hover:paused"
            )}
          >
            {CLIENTS.map((client, idx) => (
              <div
                key={idx}
                className="relative w-[200px] mx-16 shrink-0 flex items-center"
              >
                <Image
                  src={client.logo}
                  alt={client.alt}
                  width={200}
                  className="object-contain max-w-none"
                />
              </div>
            ))}
          </div>
        ))}
      </section>
      <section className="overflow-hidden px-4 py-12 sm:px-6 mt-20 flex flex-col">
        <TitleSection
          title="Pricing"
          subheading="Switch to pro plan to enjoy the unlimited"
          pill="discount 20% special for developers ✨"
        />
        <div className="flex flex-col-reverse sm:flex-row gap-4 justify-center sm:items-stretch mt-10">
          {PRICING_CARDS.map((pricing, idx) => (
            <Card
              className={clsx(
                "w-[300px] rounded-2xl dark:bg-black/40 backdrop-blur-3xl relative",
                {
                  "border-primary": pricing.planType === "Pro Plan",
                }
              )}
              key={idx}
            >
              <CardHeader>
                <CardTitle>
                  {pricing.planType === "Pro Plan" && (
                    <>
                      <div className="hidden dark:block w-full blur-[120px] rounded-full h-32 absolute bg-primary/80 -z-10 top-0" />{" "}
                    </>
                  )}
                  {pricing.planType === "Pro Plan"
                    ? `💎 Pro Plan`
                    : "Free Plan"}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-4">
                <div className="flex justify-start gap-2 items-center">
                  <span className="font-normal text-2xl">${pricing.price}</span>
                  {+pricing.price > 0 ? (
                    <span className="dark:text-primary ml-1">/month</span>
                  ) : (
                    ""
                  )}
                </div>
                <p className="dark:text-primary">{pricing.description}</p>
                <Button
                  variant="default"
                  className="whitespace-nowrap w-full mt-4"
                >
                  {pricing.planType === "Pro Plan" ? "Go Pro" : "Get Started"}
                </Button>
              </CardContent>
              <CardFooter>
                <ul className="font-normal flex mb-2 flex-col gap-4">
                  <small>{pricing.highlightFeature}</small>
                  {pricing.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
