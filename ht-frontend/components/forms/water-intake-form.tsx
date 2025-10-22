'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Droplets, Plus } from 'lucide-react';

import { LoadingButton } from '@/components/ui/loading-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {
  waterIntakeSchema,
  type WaterIntakeFormData,
} from '@/lib/validations/health';
import { WaterIntakeRequest } from '@/lib/types/health';

interface WaterIntakeFormProps {
  onSubmit: (data: WaterIntakeRequest) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

// Quick preset amounts in liters
const PRESET_AMOUNTS = [0.25, 0.5, 1.0, 1.5, 2.0];

export function WaterIntakeForm({
  onSubmit,
  isLoading = false,
  error,
}: WaterIntakeFormProps) {
  const form = useForm<WaterIntakeFormData>({
    resolver: zodResolver(waterIntakeSchema),
    defaultValues: {
      amountLtr: 0.5,
    },
  });

  const currentAmount = form.watch('amountLtr');

  const handlePresetClick = (amount: number) => {
    form.setValue('amountLtr', amount);
  };

  const onFormSubmit = async (data: WaterIntakeFormData) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (err) {
      // Error handling is managed by parent component
      console.error('Failed to submit water intake:', err);
    }
  };

  const isFormLoading = isLoading || form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-500" aria-hidden="true" />
          Add Water Intake
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-4"
            aria-label="Water intake form"
          >
            {error && (
              <Alert variant="destructive" role="alert">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Quick Preset Buttons */}
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Quick Add</legend>
              <div
                className="grid grid-cols-3 gap-2 sm:grid-cols-5"
                role="group"
                aria-label="Preset water amounts"
              >
                {PRESET_AMOUNTS.map(amount => (
                  <Button
                    key={amount}
                    type="button"
                    variant={currentAmount === amount ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePresetClick(amount)}
                    disabled={isFormLoading}
                    className="flex h-10 items-center gap-1 text-xs sm:h-9 sm:text-sm"
                    aria-label={`Add ${amount} liters`}
                    aria-pressed={currentAmount === amount}
                  >
                    <Plus className="h-3 w-3" aria-hidden="true" />
                    {amount}L
                  </Button>
                ))}
              </div>
            </fieldset>

            {/* Custom Amount Input using FormField */}
            <FormField
              control={form.control}
              name="amountLtr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Amount (Liters)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.01"
                        min="0.1"
                        max="10.0"
                        placeholder="Enter amount in liters"
                        disabled={isFormLoading}
                        className="pr-12"
                        {...field}
                        onChange={e => {
                          const value = e.target.value;
                          const numValue = parseFloat(value);
                          field.onChange(isNaN(numValue) ? 0 : numValue);
                        }}
                      />
                      <div
                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                        aria-hidden="true"
                      >
                        <span className="text-muted-foreground text-sm">L</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter a value between 0.1 and 10.0 liters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current Selection Display */}
            {currentAmount > 0 && (
              <div
                className="bg-muted/50 rounded-md p-3"
                role="status"
                aria-live="polite"
              >
                <p className="text-muted-foreground text-sm">
                  Selected amount:{' '}
                  <span className="text-foreground font-medium">
                    {currentAmount}L
                  </span>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <LoadingButton
              type="submit"
              loading={isFormLoading}
              loadingText="Adding water intake..."
              disabled={!currentAmount || currentAmount <= 0}
              className="w-full"
              icon={<Plus className="h-4 w-4" />}
              aria-describedby={
                currentAmount <= 0 ? 'submit-disabled-reason' : undefined
              }
            >
              Add Water Intake
            </LoadingButton>

            {currentAmount <= 0 && (
              <p id="submit-disabled-reason" className="sr-only">
                Please select or enter a valid water amount to continue
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
