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
import { CalendarDaysIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

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
    <div className="relative mb-6 shadow p-4 rounded-xl bg-white">
      <div className="mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex flex-row items-center gap-3 justify-between"
            >
              <CalendarDaysIcon className="size-4" />
              <span className="font-semibold">
                {format(selectedDate, "MMM yyyy")}
              </span>
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
      </div>

      <ScrollArea className="whitespace-nowrap">
        <div ref={scrollRef} className="flex w-max space-x-4 p-4 pt-0">
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
