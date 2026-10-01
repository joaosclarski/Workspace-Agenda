import { Car, Coffee, Monitor, PenLine, Video, Wifi, type LucideIcon } from "lucide-react";
import type { Amenity } from "@/types";

export const AMENITIES: Record<Amenity, { label: string; icon: LucideIcon }> = {
  wifi: { label: "Wi-Fi 1Gbps", icon: Wifi },
  coffee: { label: "Café cortesia", icon: Coffee },
  monitor: { label: "Monitor 4K", icon: Monitor },
  whiteboard: { label: "Lousa", icon: PenLine },
  videocall: { label: "Videoconferência", icon: Video },
  parking: { label: "Estacionamento", icon: Car },
};
