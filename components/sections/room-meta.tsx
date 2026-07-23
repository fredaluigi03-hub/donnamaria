import { BedDouble, Ruler, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Room } from "@/types";

export interface RoomMetaProps {
  room: Pick<Room, "guests" | "size" | "bedType">;
  className?: string;
}

/**
 * Guests / size / bed-type row — shown on both the room card
 * (rooms-showcase.tsx) and the room detail page (room-detail.tsx). Kept as
 * one component so the two never drift (e.g. one showing "m²" and the
 * other not).
 */
export function RoomMeta({ room, className }: RoomMetaProps) {
  return (
    <div
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <Users className="size-4" aria-hidden="true" />
        {room.guests}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Ruler className="size-4" aria-hidden="true" />
        {room.size}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <BedDouble className="size-4" aria-hidden="true" />
        {room.bedType}
      </span>
    </div>
  );
}
