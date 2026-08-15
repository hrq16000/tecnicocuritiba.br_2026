import React, { useEffect, useState } from "react";

type Props = {
  timeZone: string;
  label?: string;
  hour12?: boolean;
  showDate?: boolean;
};

export function WorldClock({ timeZone, label, hour12 = false, showDate = true }: Props) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12,
  });

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const tzLabel = label ?? timeZone.replace("_", " ");

  return (
    <div
      className="world-clock"
      role="group"
      aria-label={label ? `${label} time` : `Time in ${timeZone}`}
      style={{
        border: "1px solid #ddd",
        padding: "0.6rem 0.8rem",
        borderRadius: 8,
        minWidth: 180,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 12, color: "#555", marginBottom: 6 }}>{tzLabel}</div>
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{ fontVariantNumeric: "tabular-nums", fontSize: 20, fontWeight: 600 }}
      >
        {timeFormatter.format(now)}
      </div>
      {showDate && (
        <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>{dateFormatter.format(now)}</div>
      )}
    </div>
  );
}

export default WorldClock;
