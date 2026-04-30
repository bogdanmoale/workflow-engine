"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const schema = z
  .object({
    mode: z.enum(["date", "cycle"]),
    scheduledAt: z.string().optional(),
    cronExpression: z.string().optional(),
  })
  .refine((data) => data.mode !== "date" || !!data.scheduledAt, {
    message: "Date & time is required",
    path: ["scheduledAt"],
  })
  .refine((data) => data.mode !== "cycle" || !!data.cronExpression, {
    message: "Cron expression is required",
    path: ["cronExpression"],
  });

type FormValues = z.infer<typeof schema>;

const CRON_PRESETS = [
  { label: "Every second", value: "* * * * * *" },
  { label: "Every minute", value: "* * * * *" },
  { label: "Every 5 min", value: "*/5 * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day", value: "0 0 * * *" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: Record<string, unknown>;
  onSubmit: (values: FormValues) => void;
}

export const TimerTriggerDialog = ({
  open,
  onOpenChange,
  data,
  onSubmit,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      mode: (data?.mode as "date" | "cycle") || "cycle",
      scheduledAt: (data?.scheduledAt as string) || "",
      cronExpression: (data?.cronExpression as string) || "* * * * *",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        mode: (data?.mode as "date" | "cycle") || "cycle",
        scheduledAt: (data?.scheduledAt as string) || "",
        cronExpression: (data?.cronExpression as string) || "* * * * *",
      });
    }
  }, [open]);

  const mode = form.watch("mode");

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Timer Trigger</DialogTitle>
          <DialogDescription>
            Configure when this workflow should run automatically.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Execution type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="date" id="timer-mode-date" />
                        <Label htmlFor="timer-mode-date">
                          Once (specific date)
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="cycle" id="timer-mode-cycle" />
                        <Label htmlFor="timer-mode-cycle">
                          Recurring (cron)
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {mode === "date" && (
              <FormField
                control={form.control}
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {mode === "cycle" && (
              <FormField
                control={form.control}
                name="cronExpression"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cron Expression</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="* * * * *"
                        className="font-mono"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {CRON_PRESETS.map((preset) => (
                        <Button
                          key={preset.value}
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => field.onChange(preset.value)}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      5-field: min hour dom month dow · 6-field adds seconds at
                      the start
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="rounded-lg bg-muted p-4 space-y-2">
              <p className="font-medium text-sm">Available variables</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  <code className="bg-background px-1 rounded text-xs">
                    {"{{timer.firedAt}}"}
                  </code>{" "}
                  — ISO timestamp when triggered
                </li>
                <li>
                  <code className="bg-background px-1 rounded text-xs">
                    {"{{timer.mode}}"}
                  </code>{" "}
                  — "date" or "cycle"
                </li>
              </ul>
            </div>

            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
