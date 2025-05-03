'use client';

import type { DayPickerProps } from 'react-day-picker';
import { differenceInCalendarDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import {
  DayPicker,

  labelNext,
  labelPrevious,
  useDayPicker,
} from 'react-day-picker';

import { cn } from '../utils';

import { Button } from './button';
import { buttonVariants } from './button.variants';

export type CalendarProps = DayPickerProps & {
  /**
   * In the year view, the number of years to display at once.
   * @default 12
   */
  yearRange?: number;
};

function Calendar({
  className,
  classNames,
  numberOfMonths,
  showOutsideDays = true,
  yearRange = 12,
  ...props
}: CalendarProps) {
  const [navView, setNavView] = React.useState<'days' | 'years'>('days');
  const [displayYears, setDisplayYears] = React.useState<{
    from: number;
    to: number;
  }>(
    React.useMemo(() => {
      const currentYear = new Date().getFullYear();
      return {
        from: currentYear - Math.floor(yearRange / 2 - 1),
        to: currentYear + Math.ceil(yearRange / 2),
      };
    }, [yearRange]),
  );

  const { endMonth, onNextClick, onPrevClick, startMonth } = props;

  const columnsDisplayed = navView === 'years' ? 1 : numberOfMonths;

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      style={{
        width: `${248.8 * (columnsDisplayed ?? 1)}px`,
      }}
      classNames={{
        button_next: cn(
          buttonVariants({
            className:
              'absolute right-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
            variant: 'outline',
          }),
        ),
        button_previous: cn(
          buttonVariants({
            className:
              'absolute left-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
            variant: 'outline',
          }),
        ),
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium truncate',
        day: 'p-0 size-8 text-sm flex-1 flex items-center justify-center has-[button]:hover:!bg-accent rounded-lg has-[button]:hover:aria-selected:!bg-primary has-[button]:hover:text-accent-foreground has-[button]:hover:aria-selected:text-primary-foreground',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 font-normal transition-none hover:bg-transparent hover:text-inherit aria-selected:opacity-100',
        ),
        disabled: 'text-muted-foreground opacity-50',
        hidden: 'invisible',
        month: 'gap-y-4 overflow-x-hidden w-full',
        month_caption: 'flex justify-center h-7 mx-10 relative items-center',
        month_grid: 'mt-4',
        months: cn('relative flex', {
          'flex-row': props.mode === 'range',
          'flex-col': props.mode !== 'range',
        }),
        nav: 'flex items-start',
        outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        range_end: 'day-range-end rounded-e-md',
        range_middle:
          'aria-selected:bg-accent hover:aria-selected:!bg-accent rounded-none aria-selected:text-accent-foreground hover:aria-selected:text-accent-foreground',
        range_start: 'day-range-start rounded-s-md',
        selected:
          'bg-primary text-primary-foreground hover:!bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        today: 'bg-accent text-accent-foreground',
        week: 'flex w-full mt-2',
        weekday: 'text-muted-foreground w-8 font-normal text-[0.8rem]',
        weekdays: 'flex flex-row',
        ...classNames,
      }}
      components={{
        // eslint-disable-next-line react/no-nested-component-definitions
        CaptionLabel: ({ children }) => (
          <Button
            className="h-7 w-full truncate text-sm font-medium"
            variant="ghost"
            size="sm"
            onClick={() => {
              setNavView(previous => (previous === 'days' ? 'years' : 'days'));
            }}
          >
            {navView === 'days'
              ? children
              : `${displayYears.from} - ${displayYears.to}`}
          </Button>
        ),
        // eslint-disable-next-line react/no-nested-component-definitions
        Chevron: ({ orientation }) => {
          const Icon = orientation === 'left' ? ChevronLeft : ChevronRight;
          return <Icon className="size-4" />;
        },
        // eslint-disable-next-line react/no-nested-component-definitions
        MonthGrid: ({ children, className, ...props }) => {
          const { goToMonth } = useDayPicker();
          if (navView === 'years') {
            return (
              <div
                className={cn('grid grid-cols-4 gap-y-2', className)}
                {...props}
              >
                {Array.from(
                  { length: displayYears.to - displayYears.from + 1 },
                  (_, index) => {
                    const isBefore = startMonth
                      ? differenceInCalendarDays(
                        new Date(displayYears.from + index, 12, 31),
                        startMonth,
                      ) < 0
                      : false;

                    const isAfter = endMonth
                      ? differenceInCalendarDays(
                        new Date(displayYears.from + index, 0, 0),
                        endMonth,
                      ) > 0
                      : false;

                    const isDisabled = isBefore || isAfter;
                    return (
                      <Button
                        key={index}
                        className={cn(
                          'text-foreground h-7 w-full text-sm font-normal',
                          displayYears.from + index
                          === new Date().getFullYear()
                          && 'bg-accent text-accent-foreground font-medium',
                        )}
                        variant="ghost"
                        onClick={() => {
                          setNavView('days');
                          goToMonth(
                            new Date(
                              displayYears.from + index,
                              new Date().getMonth(),
                            ),
                          );
                        }}
                        disabled={navView === 'years' ? isDisabled : undefined}
                      >
                        {displayYears.from + index}
                      </Button>
                    );
                  },
                )}
              </div>
            );
          }
          return (
            <table className={className} {...props}>
              {children}
            </table>
          );
        },
        // eslint-disable-next-line react/no-nested-component-definitions
        Nav: ({ className, ...props }) => {
          const { goToMonth, nextMonth, previousMonth } = useDayPicker();

          const isPreviousDisabled = (() => {
            if (navView === 'years') {
              return (
                (startMonth
                  && differenceInCalendarDays(
                    new Date(displayYears.from - 1, 0, 1),
                    startMonth,
                  ) < 0)
                  ?? (endMonth
                    && differenceInCalendarDays(
                      new Date(displayYears.from - 1, 0, 1),
                      endMonth,
                    ) > 0)
              );
            }
            return !previousMonth;
          })();

          const isNextDisabled = (() => {
            if (navView === 'years') {
              return (
                (startMonth
                  && differenceInCalendarDays(
                    new Date(displayYears.to + 1, 0, 1),
                    startMonth,
                  ) < 0)
                  ?? (endMonth
                    && differenceInCalendarDays(
                      new Date(displayYears.to + 1, 0, 1),
                      endMonth,
                    ) > 0)
              );
            }
            return !nextMonth;
          })();

          const handlePreviousClick = React.useCallback(() => {
            if (!previousMonth) {
              return;
            }
            if (navView === 'years') {
              setDisplayYears(previous => ({
                from: previous.from - (previous.to - previous.from + 1),
                to: previous.to - (previous.to - previous.from + 1),
              }));
              onPrevClick?.(
                new Date(
                  displayYears.from - (displayYears.to - displayYears.from),
                  0,
                  1,
                ),
              );
              return;
            }
            goToMonth(previousMonth);
            onPrevClick?.(previousMonth);
          }, [previousMonth, goToMonth]);

          const handleNextClick = React.useCallback(() => {
            if (!nextMonth) {
              return;
            }
            if (navView === 'years') {
              setDisplayYears(previous => ({
                from: previous.from + (previous.to - previous.from + 1),
                to: previous.to + (previous.to - previous.from + 1),
              }));
              onNextClick?.(
                new Date(
                  displayYears.from + (displayYears.to - displayYears.from),
                  0,
                  1,
                ),
              );
              return;
            }
            goToMonth(nextMonth);
            onNextClick?.(nextMonth);
          }, [goToMonth, nextMonth]);
          return (
            <nav className={cn('flex items-center', className)} {...props}>
              <Button
                variant="outline"
                className="absolute left-0 size-7 bg-transparent p-0 opacity-80 hover:opacity-100"
                type="button"
                tabIndex={isPreviousDisabled ? undefined : -1}
                disabled={isPreviousDisabled}
                aria-label={
                  navView === 'years'
                    ? `Go to the previous ${
                      displayYears.to - displayYears.from + 1
                    } years`
                    : labelPrevious(previousMonth)
                }
                onClick={handlePreviousClick}
              >
                <ChevronLeft className="size-4" />
              </Button>

              <Button
                variant="outline"
                className="absolute right-0 size-7 bg-transparent p-0 opacity-80 hover:opacity-100"
                type="button"
                tabIndex={isNextDisabled ? undefined : -1}
                disabled={isNextDisabled}
                aria-label={
                  navView === 'years'
                    ? `Go to the next ${
                      displayYears.to - displayYears.from + 1
                    } years`
                    : labelNext(nextMonth)
                }
                onClick={handleNextClick}
              >
                <ChevronRight className="size-4" />
              </Button>
            </nav>
          );
        },
      }}
      numberOfMonths={columnsDisplayed}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
