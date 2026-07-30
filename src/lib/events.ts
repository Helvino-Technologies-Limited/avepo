export type EventStatus = "UPCOMING" | "ONGOING" | "PAST";

export function getEventStatus(event: { startDate: Date; endDate: Date }): EventStatus {
  const now = new Date();
  if (now < event.startDate) return "UPCOMING";
  if (now > event.endDate) return "PAST";
  return "ONGOING";
}
