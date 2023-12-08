import React from "react";

type TitleSectionProps = {
  title: string;
  subheading?: string;
  pill?: string;
};

export default function TitleSection({
  title,
  subheading,
  pill,
}: TitleSectionProps) {
  return (
    <React.Fragment>
      <section className="flex flex-col gap-4 justify-center items-start md:items-center">
        <div
          className="rounded-xl
            px-3
            py-1
            dark:bg-secondary"
        >
          {pill}
        </div>
        {subheading ? (
          <>
            <h2
              className="text-left
              text-3xl
              sm:text-5xl
              sm:max-w-[750px]
              md:text-center
              md:text-7xl
              font-semibold
            "
            >
              {title}
            </h2>
            <p
              className="dark:text-primary sm:max-w-[450px]
              md:text-center
            "
            >
              {subheading}
            </p>
          </>
        ) : (
          <h1
            className=" text-left 
            text-4xl
            sm:text-6xl
            sm:max-w-[850px]
            md:text-center
            md:text-8xl
            font-semibold
          "
          >
            {title}
          </h1>
        )}
      </section>
    </React.Fragment>
  );
}
