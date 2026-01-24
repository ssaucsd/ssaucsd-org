"use client";

interface FormattedDateProps {
  dateString: string;
  className?: string;
  showTime?: boolean;
}

export function FormattedDate({
  dateString,
  className,
  showTime = true,
}: FormattedDateProps) {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  if (showTime) {
    options.hour = "numeric";
    options.minute = "2-digit";
    options.timeZoneName = "short";
  }

  const formatted = date.toLocaleString(undefined, options);

  return <span className={className}>{formatted}</span>;
}
