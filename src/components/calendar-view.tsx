import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isToday,
  startOfMonth,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

interface CalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function CalendarView({
  selectedDate,
  onSelectDate,
}: CalendarViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibleDates, setVisibleDates] = useState(() => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    return eachDayOfInterval({ start, end });
  });

  useEffect(() => {
    if (scrollRef.current) {
      const selectedElement = scrollRef.current.querySelector(
        '[data-selected="true"]'
      );

      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedDate]);

  function onDateSelect(date: Date) {
    onSelectDate(date);

    setVisibleDates(() => {
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      return eachDayOfInterval({ start, end });
    });
  }

  return (
    <div className="relative mb-8">
      <div className="flex flex-row items-center justify-between mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, "MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              defaultMonth={selectedDate}
              selected={selectedDate}
              onSelect={(date) => date && onDateSelect(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <h2 className="font-semibold">{format(selectedDate, "iii, MMM dd")}</h2>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto pb-2 horizontal-scroll"
      >
        {visibleDates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isCurrent = isToday(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => onSelectDate(date)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[60px] h-20 mx-1 rounded-lg transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isCurrent
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-muted"
              )}
              data-selected={isSelected}
            >
              <span className="text-xs font-semibold mb-1">
                {format(date, "EEE")}
              </span>
              <span
                className={cn(
                  "text-2xl font-bold",
                  isCurrent && !isSelected && "text-primary"
                )}
              >
                {format(date, "dd")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
