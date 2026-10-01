export type Amenity = "wifi" | "coffee" | "monitor" | "whiteboard" | "videocall" | "parking";

export interface Space {
  id: string;
  name: string;
  kind: "Sala de reunião" | "Co-working" | "Sala privativa";
  neighborhood: string;
  city: string;
  capacity: number;
  pricePerHour: number;
  rating: number;
  reviews: number;
  image: string;
  imageAlt: string;
  amenities: Amenity[];
}

export interface Step {
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export interface SearchQuery {
  location: string;
  date: string;
  people: number;
}
