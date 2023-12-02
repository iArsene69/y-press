import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function postData({
  url,
  data,
}: {
  url: string;
  data?: { price: Price };
}) {
  const res: Response = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "applicatioin/json" }),
    credentials: "same-origin",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw Error(res.statusText);
  }
  return res.json();
}
