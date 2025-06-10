// src/components/calendar-date-picker.tsx

"use client";

import type { VariantProps } from "class-variance-authority";
import type { DateRange } from "react-day-picker";
import type { BaseInputProps } from "./input.types";
import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

import { cva } from "class-variance-authority";

import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";

import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../utils";
import { Badge } from "./badge";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// eslint-disable-next-line tailwindcss/no-contradicting-classname
const multiSelectVariants = cva(
  "flex items-center justify-start whitespace-nowrap rounded-lg text-sm font-medium text-foreground ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-background hover:bg-accent hover:text-accent-foreground",
        link: "text-background text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "outline-solid",
    },
  },
);

export type DateRangePickerProps = {
  id?: string;
  className?: string;
  value: DateRange;
  closeOnSelect?: boolean;
  numberOfMonths?: 1 | 2;
  yearsRange?: number;
  onChange: (range: { from: Date; to: Date }) => void;
} & Omit<React.HTMLAttributes<HTMLButtonElement>, "onChange"> &
  VariantProps<typeof multiSelectVariants> &
  BaseInputProps;

export const DateRangePicker = ({
  ref,
  id = "calendar-date-picker",
  className,
  value: date,
  closeOnSelect = false,
  numberOfMonths = 2,
  yearsRange = 10,
  onChange: onDateSelect,
  variant,
  placeholder,
  ...props
}: DateRangePickerProps & {
  ref?: React.RefObject<HTMLButtonElement | null>;
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [selectedRange, setSelectedRange] = React.useState<string | null>(
    numberOfMonths === 2 ? "This Year" : "Today",
  );
  const [monthFrom, setMonthFrom] = React.useState<Date | undefined>(date.from);
  const [yearFrom, setYearFrom] = React.useState<number | undefined>(
    date.from?.getFullYear(),
  );
  const [monthTo, setMonthTo] = React.useState<Date | undefined>(
    numberOfMonths === 2 ? date.to : date.from,
  );
  const [yearTo, setYearTo] = React.useState<number | undefined>(
    numberOfMonths === 2 ? date.to?.getFullYear() : date.from?.getFullYear(),
  );

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleClose = () => {
    setIsPopoverOpen(false);
  };

  const handleTogglePopover = () => {
    setIsPopoverOpen((previous) => !previous);
  };

  const selectDateRange = (from: Date, to: Date, range: string) => {
    const startDate = startOfDay(toDate(from, { timeZone }));
    const endDate =
      numberOfMonths === 2 ? endOfDay(toDate(to, { timeZone })) : startDate;
    onDateSelect({ from: startDate, to: endDate });
    setSelectedRange(range);
    setMonthFrom(from);
    setYearFrom(from.getFullYear());
    setMonthTo(to);
    setYearTo(to.getFullYear());
    if (closeOnSelect) {
      setIsPopoverOpen(false);
    }
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range) {
      let from = startOfDay(toDate(range.from!, { timeZone }));
      let to = range.to ? endOfDay(toDate(range.to, { timeZone })) : from;
      if (numberOfMonths === 1) {
        if (range.from === date.from) {
          from = startOfDay(toDate(range.to!, { timeZone }));
        } else {
          to = from;
        }
      }
      onDateSelect({ from, to });
      setMonthFrom(from);
      setYearFrom(from.getFullYear());
      setMonthTo(to);
      setYearTo(to.getFullYear());
    }
    setSelectedRange(null);
  };

  const handleMonthChange = (newMonthIndex: number, part: string) => {
    setSelectedRange(null);
    if (part === "from") {
      if (yearFrom !== undefined) {
        if (newMonthIndex < 0 || newMonthIndex > yearsRange + 1) {
          return;
        }
        const newMonth = new Date(yearFrom, newMonthIndex, 1);
        const from =
          numberOfMonths === 2
            ? startOfMonth(toDate(newMonth, { timeZone }))
            : date.from
              ? new Date(
                  date.from.getFullYear(),
                  newMonth.getMonth(),
                  date.from.getDate(),
                )
              : newMonth;
        const to =
          numberOfMonths === 2
            ? date.to
              ? endOfDay(toDate(date.to, { timeZone }))
              : endOfMonth(toDate(newMonth, { timeZone }))
            : from;
        if (from <= to) {
          onDateSelect({ from, to });
          setMonthFrom(newMonth);
          setMonthTo(date.to);
        }
      }
    } else if (yearTo !== undefined) {
      if (newMonthIndex < 0 || newMonthIndex > yearsRange + 1) {
        return;
      }
      const newMonth = new Date(yearTo, newMonthIndex, 1);
      const from = date.from
        ? startOfDay(toDate(date.from, { timeZone }))
        : startOfMonth(toDate(newMonth, { timeZone }));
      const to =
        numberOfMonths === 2
          ? endOfMonth(toDate(newMonth, { timeZone }))
          : from;
      if (from <= to) {
        onDateSelect({ from, to });
        setMonthTo(newMonth);
        setMonthFrom(date.from);
      }
    }
  };
  const today = new Date();

  const years = Array.from(
    { length: yearsRange + 1 },
    (_, index) => today.getFullYear() - yearsRange / 2 + index,
  );

  const dateRanges = [
    { label: "Today", start: today, end: today },
    { label: "Yesterday", start: subDays(today, 1), end: subDays(today, 1) },
    {
      label: "This Week",
      start: startOfWeek(today, { weekStartsOn: 1 }),
      end: endOfWeek(today, { weekStartsOn: 1 }),
    },
    {
      label: "Last Week",
      start: subDays(startOfWeek(today, { weekStartsOn: 1 }), 7),
      end: subDays(endOfWeek(today, { weekStartsOn: 1 }), 7),
    },
    { label: "Last 7 Days", start: subDays(today, 6), end: today },
    {
      label: "This Month",
      start: startOfMonth(today),
      end: endOfMonth(today),
    },
    {
      label: "Last Month",
      start: startOfMonth(subDays(today, today.getDate())),
      end: endOfMonth(subDays(today, today.getDate())),
    },
    { label: "This Year", start: startOfYear(today), end: endOfYear(today) },
    {
      label: "Last Year",
      start: startOfYear(subDays(today, 365)),
      end: endOfYear(subDays(today, 365)),
    },
  ];

  const formatWithTz = (date: Date, fmt: string) =>
    formatInTimeZone(date, timeZone, fmt);

  const handleYearChange = (newYear: number, part: string) => {
    setSelectedRange(null);
    if (part === "from") {
      if (years.includes(newYear)) {
        const newMonth = monthFrom
          ? new Date(newYear, monthFrom ? monthFrom.getMonth() : 0, 1)
          : new Date(newYear, 0, 1);
        const from =
          numberOfMonths === 2
            ? startOfMonth(toDate(newMonth, { timeZone }))
            : date.from
              ? new Date(newYear, newMonth.getMonth(), date.from.getDate())
              : newMonth;
        const to =
          numberOfMonths === 2
            ? date.to
              ? endOfDay(toDate(date.to, { timeZone }))
              : endOfMonth(toDate(newMonth, { timeZone }))
            : from;
        if (from <= to) {
          onDateSelect({ from, to });
          setYearFrom(newYear);
          setMonthFrom(newMonth);
          setYearTo(date.to?.getFullYear());
          setMonthTo(date.to);
        }
      }
    } else if (years.includes(newYear)) {
      const newMonth = monthTo
        ? new Date(newYear, monthTo.getMonth(), 1)
        : new Date(newYear, 0, 1);
      const from = date.from
        ? startOfDay(toDate(date.from, { timeZone }))
        : startOfMonth(toDate(newMonth, { timeZone }));
      const to =
        numberOfMonths === 2
          ? endOfMonth(toDate(newMonth, { timeZone }))
          : from;
      if (from <= to) {
        onDateSelect({ from, to });
        setYearTo(newYear);
        setMonthTo(newMonth);
        setYearFrom(date.from?.getFullYear());
        setMonthFrom(date.from);
      }
    }
  };

  return (
    <>
      <style>
        {`
            .date-part {
              touch-action: none;
            }
          `}
      </style>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            ref={ref}
            {...props}
            className={cn(
              "w-full",
              multiSelectVariants({ variant, className }),
            )}
            onClick={handleTogglePopover}
            suppressHydrationWarning
          >
            <CalendarIcon className="mr-2 size-4" />
            <span>
              {date.from ? (
                date.to ? (
                  <>
                    <span id={`firstDay-${id}`} className={cn("date-part")}>
                      {formatWithTz(date.from, "dd")}
                    </span>{" "}
                    <span id={`firstMonth-${id}`} className={cn("date-part")}>
                      {formatWithTz(date.from, "LLL")}
                    </span>
                    ,{" "}
                    <span id={`firstYear-${id}`} className={cn("date-part")}>
                      {formatWithTz(date.from, "y")}
                    </span>
                    {numberOfMonths === 2 && (
                      <>
                        {" - "}
                        <span
                          id={`secondDay-${id}`}
                          className={cn("date-part")}
                        >
                          {formatWithTz(date.to, "dd")}
                        </span>{" "}
                        <span
                          id={`secondMonth-${id}`}
                          className={cn("date-part")}
                        >
                          {formatWithTz(date.to, "LLL")}
                        </span>
                        ,{" "}
                        <span
                          id={`secondYear-${id}`}
                          className={cn("date-part")}
                        >
                          {formatWithTz(date.to, "y")}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <span id="day" className={cn("date-part")}>
                      {formatWithTz(date.from, "dd")}
                    </span>{" "}
                    <span id="month" className={cn("date-part")}>
                      {formatWithTz(date.from, "LLL")}
                    </span>
                    ,{" "}
                    <span id="year" className={cn("date-part")}>
                      {formatWithTz(date.from, "y")}
                    </span>
                    <span> - </span>
                    <Badge variant="outline">
                      {placeholder ?? "Pick a date"}
                    </Badge>
                  </>
                )
              ) : (
                <span>{placeholder ?? "Pick a date"}</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        {isPopoverOpen && (
          <PopoverContent
            className="w-auto"
            align="center"
            avoidCollisions={false}
            onInteractOutside={handleClose}
            onEscapeKeyDown={handleClose}
            style={{
              maxHeight: "var(--radix-popover-content-available-height)",
              overflowY: "auto",
            }}
          >
            <div className="flex">
              {numberOfMonths === 2 && (
                <div className="hidden flex-col gap-1 border-r border-foreground/10 pr-4 text-left md:flex">
                  {dateRanges.map(({ label, start, end }) => (
                    <Button
                      key={label}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "hover:bg-primary/90 hover:text-background justify-start",
                        selectedRange === label &&
                          "bg-primary text-background hover:bg-primary/90 hover:text-background",
                      )}
                      onClick={() => {
                        selectDateRange(start, end, label);
                        setMonthFrom(start);
                        setYearFrom(start.getFullYear());
                        setMonthTo(end);
                        setYearTo(end.getFullYear());
                      }}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              )}
              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <div className="ml-3 flex gap-2">
                    <Select
                      onValueChange={(value) => {
                        handleMonthChange(months.indexOf(value), "from");
                        setSelectedRange(null);
                      }}
                      value={
                        monthFrom ? months[monthFrom.getMonth()] : undefined
                      }
                    >
                      <SelectTrigger className="hidden w-[122px] font-medium hover:bg-accent hover:text-accent-foreground focus:ring-0 focus:ring-offset-0 sm:flex">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month, index) => (
                          <SelectItem key={index} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={(value) => {
                        handleYearChange(Number(value), "from");
                        setSelectedRange(null);
                      }}
                      value={yearFrom ? yearFrom.toString() : undefined}
                    >
                      <SelectTrigger className="hidden w-[122px] font-medium hover:bg-accent hover:text-accent-foreground focus:ring-0 focus:ring-offset-0 sm:flex">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year, index) => (
                          <SelectItem key={index} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {numberOfMonths === 2 && (
                    <div className="flex gap-2">
                      <Select
                        onValueChange={(value) => {
                          handleMonthChange(months.indexOf(value), "to");
                          setSelectedRange(null);
                        }}
                        value={monthTo ? months[monthTo.getMonth()] : undefined}
                      >
                        <SelectTrigger className="hidden w-[122px] font-medium hover:bg-accent hover:text-accent-foreground focus:ring-0 focus:ring-offset-0 sm:flex">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month, index) => (
                            <SelectItem key={index} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        onValueChange={(value) => {
                          handleYearChange(Number(value), "to");
                          setSelectedRange(null);
                        }}
                        value={yearTo ? yearTo.toString() : undefined}
                      >
                        <SelectTrigger className="hidden w-[122px] font-medium hover:bg-accent hover:text-accent-foreground focus:ring-0 focus:ring-offset-0 sm:flex">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year, index) => (
                            <SelectItem key={index} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <div className="flex">
                  <Calendar
                    mode="range"
                    defaultMonth={monthFrom}
                    month={monthFrom}
                    onMonthChange={setMonthFrom}
                    selected={date}
                    onSelect={handleDateSelect}
                    numberOfMonths={numberOfMonths}
                    showOutsideDays={false}
                    className={className}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        )}
      </Popover>
    </>
  );
};

DateRangePicker.displayName = "DateRangePicker";
