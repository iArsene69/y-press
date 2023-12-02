import TitleSection from "@/components/landing-page/title-section";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { CLIENTS } from "@/lib/constants";
import Image from "next/image";
import React from "react";

export default function HomePage() {
  return (
    <>
      <section className="overflow-hidden px-4 sm:px-6 mt-10 sm:flex sm:flex-col gap-4 md:justify-center md:items-center">
        <TitleSection pill="Wazzup" title="Your workspaces, Evolve!" />
        <div className="bg-white p-[2px] mt-6 mb-16 rounded-xl bg-gradient-to-r from-primary to-secondary sm:w-[300px]">
          <Button
            variant={"secondary"}
            className="w-full rounded-[10px] p-6 text-2xl bg-background"
          >
            Get Ypress Free
          </Button>
        </div>
        <div className="md:mt-[-90px] sm:w-full w-750px flex justify-center items-center mt-[-40px] relative sm:ml-0 mx-[-50px]">
          <AspectRatio ratio={2 / 1}>
            <Image
              src={`/img/appBanner.png`}
              fill
              alt="App banner"
            />
          </AspectRatio>
          <div className="absolute bottom-0 top-[-50%] bg-gradient-to-t dark:from-background left-0 right-0 z-10"></div>
        </div>
      </section>
      <section className="relative">
        <div
          className="overflow-hidden 
          flex 
          after:content['']
          after:to-transparent 
          after:from-background 
          after:bg-gradient-to-l 
          after:right-0 
          after:bottom-0 
          after:top-0
          after:w-20 
          after:z-10 
          after:absolute 
          before:content['']
          before:to-transparent 
          before:from-background 
          before:bg-gradient-to-r
          before:left-0 
          before:bottom-0 
          before:top-0
          before:w-20 
          before:z-10 
          before:absolute"
        >
          {[...Array(2)].map((arr) => (
            <div key={arr} className="flex flex-nowrap animate-slide">
              {CLIENTS.map((client, idx) => (
                <div key={idx} className="relative w-[200px] m-20 shrink-0 flex items-center">
                  <Image src={client.logo} alt={client.alt} width={200} height={20} className="object-contain max-w-none" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      {/* <section className="px-4 sm:px-6 flex justify-center items-center flex-col relative">
        <div className="w-[30%] blur-[120px] rounded-full h-32 absolute bg-primary/50 -z-10 top-20"></div>
      </section> */}
    </>
  );
}
