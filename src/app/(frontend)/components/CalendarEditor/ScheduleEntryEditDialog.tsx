import React, { useState } from "react";
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
import {formatTime, ScheduleEntry, Time} from "@/app/(frontend)/components/CalendarEditor/utils";
import {Day} from "@prisma/client";

type EntryDialogProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  shows: { id: number; title: string }[];
  initialValues: Omit<ScheduleEntry, "radioShowId"> & {
    radioShowId: number | undefined
  } | null;
  scheduleStart: Date;
  scheduleEnd: Date;
  onClose: () => void;
  onSave: (data: {
    radioShowId: number
    day: Day
    startTime: Time
    endTime: Time
  }) => void;
};

export function EntryDialog({ isOpen,
                              mode,
                              shows,
                              initialValues,
                              scheduleStart,
                              scheduleEnd,
                              onClose,
                              onSave,
                            }: EntryDialogProps) {
  if (initialValues === null) {
    console.log("No initial values given")
    return;
  }
  // Controlled form state
  const [radioShowId, setRadioShowId] = useState(initialValues.radioShowId);
  const [day, setDay] = useState(initialValues.day);
  const [startTime, setStartTime] = useState(initialValues.startTime);
  const [endTime, setEndTime] = useState(initialValues.endTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (radioShowId === undefined) {
      console.error("radioShowId should have a value before being able to save");
      return;
    }

    onSave({
      radioShowId,
      day,
      startTime,
      endTime,
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
                    <TextField.Root type="time" value={formatTime(startTime)} onChange={e => {
                      const [hours, minutes] = e.target.value.split(":")
                      setStartTime({hours: parseInt(hours), minutes: parseInt(minutes)})
                    }} />
                  </Flex>

                  <Flex direction="row" gap="2" align="center">
                    <Text size="2">to</Text>
                    <TextField.Root type="time" value={formatTime(endTime)} onChange={e => {
                      console.log(`time:${e.target.value}`)
                      const [hours, minutes] = e.target.value.split(":");
                      setEndTime({hours: parseInt(hours), minutes: parseInt(minutes)});
                    }} />
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
              {/*<Flex direction="column" gap="3">*/}
              {/*  <Text size="3" weight="medium">Show-run duration</Text>*/}
              {/*  <Callout.Root>*/}
              {/*    <Callout.Text>*/}
              {/*      By default, this show will run from the start to the end of this schedule&#39;s specified dates. However, you can change when it starts and ends if this show was added or drops out.*/}
              {/*      </Callout.Text>*/}
              {/*    </Callout.Root>*/}
              {/*  <Flex gap="4" direction="column" wrap="wrap">*/}
              {/*    /!* Active From *!/*/}
              {/*    <Flex direction="row" gap="1" width="100%" justify="between">*/}
              {/*      <Flex direction="row" gap="2" align="center">*/}
              {/*        <Text as="label" size="2" htmlFor="useActiveFrom">*/}
              {/*          <Flex gap="2" align="center">*/}
              {/*            <Switch id="useActiveFrom" checked={useActiveFrom} onCheckedChange={v => setUseActiveFrom(v)} />*/}
              {/*            Delayed start date*/}
              {/*          </Flex>*/}
              {/*        </Text>*/}
              {/*      </Flex>*/}
              {/*      {useActiveFrom && (*/}
              {/*          <TextField.Root*/}
              {/*              type="date"*/}
              {/*              value={activeFrom.toISOString().slice(0, 10)}*/}
              {/*              onChange={e => setActiveFrom(new Date(e.target.value))}*/}
              {/*              min={scheduleStart.toISOString().slice(0,10)}*/}
              {/*              max={activeUntil.toISOString().slice(0,10)}*/}
              {/*          />*/}
              {/*      )}*/}
              {/*    </Flex>*/}

              {/*    /!* Active Until *!/*/}
              {/*    <Flex direction="row" gap="1" width="100%" justify="between">*/}
              {/*      <Flex direction="row" gap="2" align="center">*/}
              {/*        <Text as="label" size="2" htmlFor="useActiveUntil">*/}
              {/*          <Flex gap="2" align="center">*/}
              {/*            <Switch id="useActiveUntil" checked={useActiveUntil} onCheckedChange={v => setUseActiveUntil(v)} />*/}
              {/*            Early finish date*/}
              {/*          </Flex>*/}
              {/*        </Text>*/}
              {/*      </Flex>*/}
              {/*      {useActiveUntil && (*/}
              {/*          <TextField.Root*/}
              {/*              type="date"*/}
              {/*              value={activeUntil.toISOString().slice(0, 10)}*/}
              {/*              onChange={e => setActiveUntil(new Date(e.target.value))}*/}
              {/*              min={activeFrom.toISOString().slice(0,10)}*/}
              {/*              max={scheduleEnd.toISOString().slice(0,10)}*/}
              {/*          />*/}
              {/*      )}*/}
              {/*    </Flex>*/}
              {/*  </Flex>*/}
              {/*</Flex>*/}

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