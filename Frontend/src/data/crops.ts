import maize from "@/assets/crop-maize.jpg";
import beans from "@/assets/crop-beans.jpg";
import potatoes from "@/assets/crop-potatoes.jpg";
import tomatoes from "@/assets/crop-tomatoes-sm.jpg";
import tomatoesHero from "@/assets/crop-tomatoes.jpg";
import kales from "@/assets/crop-kales.jpg";

export type CropId = "maize" | "beans" | "potatoes" | "tomatoes" | "kales" | "onions" | "cabbage" | "coffee";

export const CROPS: Record<CropId, { id: CropId; name: string; emoji: string; unit: string; image: string; hero?: string }> = {
  maize:    { id: "maize",    name: "Maize",    emoji: "🌽", unit: "90kg bag", image: maize },
  beans:    { id: "beans",    name: "Beans",    emoji: "🫘", unit: "90kg bag", image: beans },
  potatoes: { id: "potatoes", name: "Potatoes", emoji: "🥔", unit: "50kg bag", image: potatoes },
  tomatoes: { id: "tomatoes", name: "Tomatoes", emoji: "🍅", unit: "crate",    image: tomatoes, hero: tomatoesHero },
  kales:    { id: "kales",    name: "Kales",    emoji: "🥬", unit: "bunch",    image: kales },
  onions:   { id: "onions",   name: "Onions",   emoji: "🧅", unit: "net",      image: potatoes },
  cabbage:  { id: "cabbage",  name: "Cabbage",  emoji: "🥬", unit: "head",     image: kales },
  coffee:   { id: "coffee",   name: "Coffee",   emoji: "☕", unit: "kg",       image: beans },
};
