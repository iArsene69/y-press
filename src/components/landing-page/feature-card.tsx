import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";

type FeatureCardProps = {
  title: string;
  description: string;
  className?: string;
  content?: React.ReactNode;
  bgUrl?: string;
};

export default function FeatureCard({
  title,
  description,
  className,
  content,
  bgUrl,
}: FeatureCardProps) {
  return (
    <Card
      className={cn("w-[300px]", className)}
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      <div className="filter backdrop-brightness-50">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
        <CardFooter>button or smth</CardFooter>
      </div>
    </Card>
  );
}
