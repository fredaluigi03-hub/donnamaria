import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RoomDetail } from "@/components/sections/room-detail";
import { getRoomBySlug } from "@/config/rooms";
import { buildMetadata } from "@/lib/metadata";

const room = getRoomBySlug("suite-francy");

export const metadata: Metadata = buildMetadata({
  title: room?.name,
  description: room?.shortDescription,
});

export default function SuiteFrancyPage() {
  if (!room) notFound();
  return <RoomDetail room={room} />;
}
