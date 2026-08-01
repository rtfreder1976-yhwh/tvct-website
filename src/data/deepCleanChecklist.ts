/**
 * The deep-clean checklist, extracted from /services/deep-cleaning so the
 * counts derive from the list itself instead of being asserted separately.
 *
 * /services/deep-cleaning already rendered its totals by reducing over this
 * array, which is why the page says 57 tasks across 9 room types while 41 other
 * files assert a hardcoded "49-point checklist". Exporting the derived counts
 * means the rendered number can never drift from the list again.
 */

export interface ChecklistSection {
  section: string;
  icon: string;
  tasks: string[];
}

export const deepCleanChecklist: ChecklistSection[] = [
  {
    section: "All Rooms",
    icon: "home",
    tasks: [
      "Remove cobwebs",
      "Empty trash",
      "Sweep/vacuum floors (carpet + hard surfaces)",
      "Mop floors (hard surfaces)",
      "Dust shelves",
      "Dust blinds, windows, window sills",
      "Wipe & clean mirrors",
      "Wipe & clean light switches",
      "Clean glass surfaces",
      "Dust baseboards",
      "Dust reachable ceiling fans & vents",
      "Dust furniture/lamps",
    ],
  },
  {
    section: "Kitchen",
    icon: "kitchen-set",
    tasks: [
      "Inside/outside of microwave oven",
      "Clean backsplash",
      "Exterior of trash can",
      "Outside of stove hood",
      "Clean stovetop",
      "Countertops",
      "Clean sink & chrome",
      "Exterior of cabinets & drawers",
      "Pantry floor & door",
      "Top of refrigerator",
      "Tables and chairs",
      "Outside of appliances",
    ],
  },
  {
    section: "Bathrooms",
    icon: "bath",
    tasks: [
      "Clean shower",
      "Clean tub",
      "Polish faucets",
      "Clean sinks",
      "Clean toilet and toilet area",
      "Clean counters",
      "Dust ledges",
      "Exterior of cabinets and drawers",
      "Dust doors & door frames",
      "Vacuum rugs",
    ],
  },
  {
    section: "Bedrooms",
    icon: "bed",
    tasks: [
      "Make beds (change linen if available)",
      "Vacuum rugs",
      "Exterior of cabinets and drawers",
      "Dust ledges",
      "Dust doors & door frames",
    ],
  },
  {
    section: "Laundry Room",
    icon: "shirt",
    tasks: [
      "Dust and wipe the outside of washer & dryer",
      "Clean sinks",
      "Vacuum rugs",
      "Countertops",
      "Dust ledges",
      "Dust doors & door frames",
    ],
  },
  {
    section: "Dining Room",
    icon: "utensils",
    tasks: ["Dust ledges", "Tables & chairs", "Dust doors & door frames"],
  },
  {
    section: "Living Room",
    icon: "couch",
    tasks: [
      "Dust ledges",
      "Exterior of cabinets & drawers",
      "Dust doors & door frames",
    ],
  },
  {
    section: "Office",
    icon: "briefcase",
    tasks: [
      "Dust ledges",
      "Vacuum rugs",
      "Exterior of cabinets & drawers",
      "Dust doors & door frames",
    ],
  },
  {
    section: "Extra Services",
    icon: "star",
    tasks: [
      "Wet wipe windows & blinds",
      "Hand detail baseboards",
    ],
  },
];

/** Total individual tasks across every room type. Currently 57. */
export const DEEP_CLEAN_TASK_COUNT: number = deepCleanChecklist.reduce(
  (total, room) => total + room.tasks.length,
  0,
);

/** Number of room types covered. Currently 9. */
export const DEEP_CLEAN_ROOM_COUNT: number = deepCleanChecklist.length;
