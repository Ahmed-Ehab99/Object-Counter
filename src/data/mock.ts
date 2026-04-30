import helixTower from "/helix-tower.jpg";

export const detections = [
  {
    id: "OBJECT_042",
    label: "SERVER_RACK",
    confidence: 98.4,
    color: "cyan" as const,
    box: { top: "10%", left: "14%", width: "16%", height: "22%" },
  },
  {
    id: "ENTITY_009",
    label: "PERSON",
    confidence: 72.1,
    color: "purple" as const,
    box: { top: "60%", left: "70%", width: "8%", height: "22%" },
  },
  {
    id: "OBJECT_117",
    label: "THERMAL_LEAD",
    confidence: 82.1,
    color: "purple" as const,
    box: { top: "32%", left: "44%", width: "10%", height: "12%" },
  },
];

export const tabs = ["ALL SCANS", "Item 1", "ELECTRONICS", "ARCHITECTURAL"];

export const distribution = [
  { label: "Industrial Assets", value: 42, color: "cyan" as const },
  { label: "Safety Equipment", value: 28, color: "purple" as const },
];

export const metrics = [
  {
    label: "Classification Accuracy",
    value: 99.2,
    suffix: "%",
    color: "cyan" as const,
  },
  {
    label: "Processing Latency",
    value: 14,
    suffix: "ms",
    max: 50,
    color: "purple" as const,
  },
  {
    label: "Object Persistence",
    value: 88.5,
    suffix: "%",
    color: "cyan" as const,
  },
];

export const pastWeek = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  title: "Helix Tower Concept",
  date: "April 10, 2024",
  image: helixTower,
}));
