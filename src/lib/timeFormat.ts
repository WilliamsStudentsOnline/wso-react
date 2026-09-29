export const normalizeClockTime = (timeStr: string): string => {
  const trimmed = timeStr.trim();
  if (/^\d{1,2}(am|pm)$/i.test(trimmed)) {
    return trimmed.replace(/(am|pm)/i, ":00$1");
  }
  return trimmed;
};

const compactTimePart = (time: string): string =>
  normalizeClockTime(time).replace(/:00(?=[ap]m)/i, "");

export const formatCompactHours = (open: string, close: string): string => {
  let openPart = compactTimePart(open);
  const closePart = compactTimePart(close);
  const openMeridiem = openPart.match(/([ap]m)$/i)?.[1];
  const closeMeridiem = closePart.match(/([ap]m)$/i)?.[1];
  if (
    openMeridiem &&
    closeMeridiem &&
    openMeridiem.toLowerCase() === closeMeridiem.toLowerCase()
  ) {
    openPart = openPart.replace(/[ap]m$/i, "");
  }
  return `${openPart}–${closePart}`;
};
