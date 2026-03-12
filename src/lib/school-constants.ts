export const SECTIONS = ["Primary", "Nursery"] as const;
export type Section = (typeof SECTIONS)[number];

export const CLASSES_BY_SECTION: Record<Section, string[]> = {
  Primary: [
    "Primary 1",
    "Primary 2",
    "Primary 3",
    "Primary 4",
    "Primary 5",
    "Primary 6",
    "Primary 7",
  ],
  Nursery: [
    "Baby",
    "Middle",
    "Top",
  ],
};

export const ALL_CLASSES = [
  ...CLASSES_BY_SECTION.Primary,
  ...CLASSES_BY_SECTION.Nursery,
];
