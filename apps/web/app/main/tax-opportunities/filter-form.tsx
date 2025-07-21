'use client';

import { Button } from '@repo/ui/components/button';
import { cn } from '@repo/ui/utils';
import { ChevronDown, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';
import InputField from '@repo/ui/form-builder/fields/input.field';
import ComboboxMultiField from '@repo/ui/form-builder/fields/combobox-multi.field';
import DatePickerField from '@repo/ui/form-builder/fields/date-picker.field';

const filterFormSchema = z.object({
  minPAndL: z.coerce.number().min(0).optional(),
  excludeAssetSymbols: z.array(z.string()).optional(),
  purchaseDateBefore: z.date().nullable().optional(),
  purchaseDateAfter: z.date().nullable().optional(),
});

export type FilterFormData = z.infer<typeof filterFormSchema>;

const itemVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
  },
};

interface FilterFormProps {
  onFiltersSubmit: (filters: FilterFormData) => void;
  initialValues: FilterFormData;
  numberOfActiveFilters: number;
  onClearFilters: () => void;
  uniqueAssetSymbols: string[];
}

export function FilterForm({
  onFiltersSubmit,
  initialValues,
  numberOfActiveFilters,
  onClearFilters,
  uniqueAssetSymbols,
}: FilterFormProps) {
  const [showFilters, setShowFilters] = useState(false);

  const { form, handleSubmit } = useStandardForm<FilterFormData>({
    defaultValues: initialValues,
    resolver: zodResolver(filterFormSchema),
    handleSubmit: data => {
      onFiltersSubmit(data);
    },
  });

  return (
    <motion.div variants={itemVariants}>
      <div className="overflow-hidden rounded-xl border">
        {/* Filter Button - Top Part */}
        <div className="bg-muted/50 flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 transition-all duration-200',
              showFilters && 'bg-background'
            )}
          >
            <Filter className="size-4" />
            Filters
            {numberOfActiveFilters > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                {numberOfActiveFilters}
              </span>
            )}
            <ChevronDown
              className={cn(
                'size-4 transition-transform duration-200',
                showFilters && 'rotate-180'
              )}
            />
          </Button>

          {numberOfActiveFilters > 0 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                form.reset({
                  minPAndL: 0,
                  excludeAssetSymbols: [],
                  purchaseDateBefore: null,
                  purchaseDateAfter: null,
                });
                onClearFilters();
              }}
            >
              Clear all filters
            </Button>
          )}
        </div>

        {/* Animated Filter Form */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: 'auto',
                opacity: 1,
                transition: {
                  height: { duration: 0.3, ease: 'easeOut' },
                  opacity: { duration: 0.2, delay: 0.1 },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.3, ease: 'easeIn' },
                  opacity: { duration: 0.1 },
                },
              }}
              className="bg-background border-t"
            >
              <motion.div
                initial={{ y: -10 }}
                animate={{
                  y: 0,
                  transition: { duration: 0.2, delay: 0.1 },
                }}
                exit={{ y: -10 }}
                className="p-4"
              >
                <FormProvider {...form}>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <InputField
                          name="minPAndL"
                          label="Min Profit or Loss ($ Absolute Value)"
                          type="number"
                          placeholder="e.g. 100"
                          description="Minimum dollar amount for profit or loss"
                        />
                      </div>

                      <div>
                        <ComboboxMultiField
                          name="excludeAssetSymbols"
                          label="Exclude Symbols"
                          options={uniqueAssetSymbols.map(symbol => ({
                            label: symbol,
                            value: symbol,
                          }))}
                          placeholder="Select symbols to exclude"
                          description="Asset symbols to exclude from results"
                        />
                      </div>

                      <div>
                        <DatePickerField
                          name="purchaseDateBefore"
                          label="Purchased Before"
                          type="date"
                          description="Only include lots purchased before this date"
                        />
                      </div>

                      <div>
                        <DatePickerField
                          name="purchaseDateAfter"
                          label="Purchased After"
                          type="date"
                          description="Only include lots purchased after this date"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowFilters(false)}
                      >
                        Cancel
                      </Button>
                      <Button disabled={!form.formState.isDirty} type="submit">
                        Apply Filters
                      </Button>
                    </div>
                  </form>
                </FormProvider>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
