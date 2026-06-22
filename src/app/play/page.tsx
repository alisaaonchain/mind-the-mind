import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Lab } from "@/components/play/Lab";

export const metadata: Metadata = {
  title: "/play — Enter the Lab · Mind the Mind",
  description:
    "Interrogate an AI with a hidden objective, trade a 60-second bonding curve against it, then see exactly what it was thinking.",
};

export default function PlayPage() {
  return (
    <>
      <SiteNav />
      <Lab />
      <SiteFooter />
    </>
  );
}
