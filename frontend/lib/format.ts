export function formatTimestamp(date: Date): {
  relative: string;
  absolute: string;
} {
  const absolute = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const diffMinutes = Math.max(
    0,
    Math.round((Date.now() - date.getTime()) / 60000),
  );

  const relative =
    diffMinutes === 0
      ? "Just now"
      : diffMinutes === 1
        ? "1 min ago"
        : `${diffMinutes} min ago`;

  return { relative, absolute };
}

export function formatElapsed(minutes: number): string {
  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 min";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatDueIn(minutes: number): string {
  if (minutes === 0) return "Due now";
  if (minutes < 0) {
    const overdue = Math.abs(minutes);
    return overdue === 1 ? "1 min overdue" : `${overdue} min overdue`;
  }
  if (minutes === 1) return "Due in 1 min";
  if (minutes < 60) return `Due in ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `Due in ${hours}h ${mins}m` : `Due in ${hours}h`;
}

export function formatDueTime(dueInMinutes: number): {
  relative: string;
  absolute: string;
} {
  const dueAt = new Date(Date.now() + dueInMinutes * 60_000);
  const absolute = dueAt.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return {
    relative: formatDueIn(dueInMinutes),
    absolute,
  };
}

export function formatShiftRemaining(shiftEnd: string): string {
  const [hours, minutes] = shiftEnd.split(":").map(Number);
  const end = new Date();
  end.setHours(hours, minutes, 0, 0);

  const diffMs = end.getTime() - Date.now();
  if (diffMs <= 0) return "Shift ended";

  const totalMinutes = Math.round(diffMs / 60000);
  if (totalMinutes < 60) {
    return totalMinutes === 1 ? "1 min left" : `${totalMinutes} min left`;
  }

  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (m === 0) return `${h}h left`;
  return `${h}h ${m}m left`;
}
