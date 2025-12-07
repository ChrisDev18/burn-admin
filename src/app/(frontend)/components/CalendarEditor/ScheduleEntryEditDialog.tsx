import { useState, useEffect } from "react";
import {
  Dialog,
  Button,
  Text,
  Select,
  TextField,
  Flex,
  Checkbox,
  Grid, Switch, Callout,
} from "@radix-ui/themes";
import { jsToDay, toTimeString } from "@/app/lib/calendar/utils";
import {Day} from "@prisma/client";
import {ScheduleEntry} from "@/modules/domain/model/ScheduleEntry";

type EntryDialogProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  shows: { id: number; title: string }[];
  initialValues?: Partial<ScheduleEntry>;
  scheduleStart: Date;
  scheduleEnd: Date;
  onClose: () => void;
  onSave: (data: Partial<ScheduleEntry>) => void;
};

export function EntryDialog({
                              isOpen,
                              mode,
                              shows,
                              initialValues = {},
                              scheduleStart,
                              scheduleEnd,
                              onClose,
                              onSave,
                            }: EntryDialogProps) {
  // Controlled form state
  const [radioShowId, setRadioShowId] = useState(initialValues.radioShowId ?? shows[0]?.id ?? 0);
  const [day, setDay] = useState<Day>(initialValues.day ?? "MON");
  const [startTime, setStartTime] = useState(initialValues.startTime ?? "09:00");
  const [endTime, setEndTime] = useState(initialValues.endTime ?? "10:00");

  const [useActiveFrom, setUseActiveFrom] = useState(!!initialValues.activeFrom);
  const [activeFrom, setActiveFrom] = useState(
      initialValues.activeFrom ?? scheduleStart
  );

  const [useActiveUntil, setUseActiveUntil] = useState(!!initialValues.activeUntil);
  const [activeUntil, setActiveUntil] = useState(
      initialValues.activeUntil ?? scheduleEnd
  );

  // Keep activeFrom/activeUntil within bounds when one changes
  useEffect(() => {
    if (activeFrom > activeUntil) setActiveUntil(activeFrom);
  }, [activeFrom]);

  useEffect(() => {
    if (activeUntil < activeFrom) setActiveFrom(activeUntil);
  }, [activeUntil]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      radioShowId,
      day,
      startTime,
      endTime,
      activeFrom: useActiveFrom ? activeFrom : null,
      activeUntil: useActiveUntil ? activeUntil : null,
    });
  };

  return (
      <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Dialog.Content size="3">
          <Dialog.Title mb="6">
            {mode === "edit" ? "Edit Schedule Entry" : "Create Schedule Entry"}
          </Dialog.Title>

          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="5">
              {/* Radio Show */}
              <Flex direction="column" gap="3">
                <Text size="3" weight="medium">Radio Show</Text>
                <Select.Root value={String(radioShowId)} onValueChange={v => setRadioShowId(Number(v))}>
                  <Select.Trigger placeholder="Select a show" />
                  <Select.Content>
                    {shows.map(s => (
                        <Select.Item key={s.id} value={String(s.id)}>
                          {s.title}
                        </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Flex>

              {/* Show Time */}
              <Flex direction="column" gap="3">
                <Text size="3" weight="medium">Show Time</Text>
                <Flex gap="2" wrap="wrap">
                  <Flex direction="row" gap="2" align="center">
                    <Text size="2">On-air from</Text>
                    <TextField.Root type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                  </Flex>

                  <Flex direction="row" gap="2" align="center">
                    <Text size="2">to</Text>
                    <TextField.Root type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                  </Flex>

                  <Flex direction="row" gap="2" align="center">
                    <Text size="2">on</Text>
                    <Select.Root value={day} onValueChange={v => setDay(v as Day)}>
                      <Select.Trigger placeholder="Select a day" />
                      <Select.Content>
                        {jsToDay.map(d => (
                            <Select.Item key={d} value={d}>{d}</Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                </Flex>
              </Flex>

              {/* Showrun Period */}
              <Flex direction="column" gap="3">
                <Text size="3" weight="medium">Show-run duration</Text>
                <Callout.Root>
                  <Callout.Text>
                    By default, this show will run from the start to the end of this schedule&#39;s specified dates. However, you can change when it starts and ends if this show was added or drops out.
                    </Callout.Text>
                  </Callout.Root>
                <Flex gap="4" direction="column" wrap="wrap">
                  {/* Active From */}
                  <Flex direction="row" gap="1" width="100%" justify="between">
                    <Flex direction="row" gap="2" align="center">
                      <Text as="label" size="2" htmlFor="useActiveFrom">
                        <Flex gap="2" align="center">
                          <Switch id="useActiveFrom" checked={useActiveFrom} onCheckedChange={v => setUseActiveFrom(v)} />
                          Delayed start date
                        </Flex>
                      </Text>
                    </Flex>
                    {useActiveFrom && (
                        <TextField.Root
                            type="date"
                            value={activeFrom.toISOString().slice(0, 10)}
                            onChange={e => setActiveFrom(new Date(e.target.value))}
                            min={scheduleStart.toISOString().slice(0,10)}
                            max={activeUntil.toISOString().slice(0,10)}
                        />
                    )}
                  </Flex>

                  {/* Active Until */}
                  <Flex direction="row" gap="1" width="100%" justify="between">
                    <Flex direction="row" gap="2" align="center">
                      <Text as="label" size="2" htmlFor="useActiveUntil">
                        <Flex gap="2" align="center">
                          <Switch id="useActiveUntil" checked={useActiveUntil} onCheckedChange={v => setUseActiveUntil(v)} />
                          Early finish date
                        </Flex>
                      </Text>
                    </Flex>
                    {useActiveUntil && (
                        <TextField.Root
                            type="date"
                            value={activeUntil.toISOString().slice(0, 10)}
                            onChange={e => setActiveUntil(new Date(e.target.value))}
                            min={activeFrom.toISOString().slice(0,10)}
                            max={scheduleEnd.toISOString().slice(0,10)}
                        />
                    )}
                  </Flex>
                </Flex>
              </Flex>

              {/* Submit */}
              <Button type="submit">
                Save
              </Button>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Root>
  );
}