"use client"

import {
  Text,
  Flex,
  Button,
  Callout,
  TextField,
  Box, Container
} from "@radix-ui/themes";
import {ExclamationTriangleIcon} from "@radix-ui/react-icons";
import {ChangeEvent, useReducer} from "react";
import {editScheduleReducer} from "@/app/(frontend)/scheduling/[scheduleId]/edit/editScheduleReducer";
import PageHero from "@/app/(frontend)/components/PageHero";
import ScheduleCalendar from "@/app/(frontend)/components/CalendarEditor/CalendarEditor";
import {RadioShow} from "@/modules/domain/model/RadioShow";
import {ScheduleWithEntries} from "@/modules/domain/model/Schedule";
import {ScheduleEntry, toTime} from "@/app/(frontend)/components/CalendarEditor/utils";


export default function EditScheduleView({ originalSchedule, shows }: {
  originalSchedule: ScheduleWithEntries,
  shows: RadioShow[]
}) {
  const [state, dispatch] = useReducer(editScheduleReducer, {
    loading: false,
    schedule: {
      ...originalSchedule,
      entries: originalSchedule.entries.map((entry, i) => ({
        id: entry.id,
        key: i,
        scheduleId: entry.scheduleId,
        radioShowId: entry.radioShowId,
        day: entry.day,
        startTime: toTime(entry.startTime),
        endTime: toTime(entry.endTime)
      }))
    },
    originalSchedule: {
      ...originalSchedule,
      entries: originalSchedule.entries.map((entry, i) => ({
        id: entry.id,
        key: i,
        scheduleId: entry.scheduleId,
        radioShowId: entry.radioShowId,
        day: entry.day,
        startTime: toTime(entry.startTime),
        endTime: toTime(entry.endTime)
      }))
    },
    error: null
  });

  const hasChanges = JSON.stringify(state.schedule) !== JSON.stringify(state.originalSchedule);

  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    dispatch({ type: "SET_START_DATE", payload: selectedDate });
  };

  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    dispatch({ type: "SET_END_DATE", payload: selectedDate });
  };

  return (
      <>
        <PageHero layout={"editForm"}
                  header={"Edit Schedule"}
                  title={state.schedule.name}
                  titlePlaceholder={"No schedule name"}
                  back={"/scheduling"} />

        <Flex width={"100%"} p="6" direction={"column"} align={"center"} height={"100%"} flexGrow={"1"}>
            <Flex maxWidth={"1136px"} width={"100%"} flexGrow={"1"} direction="column" gap="4">
              <Flex direction="column" gap="4" mb="6">

                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Schedule name *
                  </Text>
                  <TextField.Root
                      value={state.schedule.name}
                      onChange={(x) => dispatch({type: "SET_NAME", payload: x.target.value})}
                      placeholder="Enter the schedule's name"
                      required
                  />
                </label>

                <Flex direction="row" gap="3" align="center" justify="between" wrap="wrap" asChild>
                  <Text as="label">
                    <Flex gap="4" align="center">
                      <Box>
                        <Text as="p" size="2" weight="medium">Start Date</Text>
                        <Text as="p" size="1">Determine when this schedule starts</Text>
                      </Box>
                    </Flex>

                    <TextField.Root type="date"
                                    value={state.schedule.startDate.toISOString().split("T")[0]}
                                    onChange={handleStartDateChange}
                    />
                  </Text>
                </Flex>

                <Flex direction="row" gap="3" align="center" justify="between" wrap="wrap" asChild>
                  <Text as="label">
                    <Flex gap="4" align="center">
                      <Box>
                        <Text as="p" size="2" weight="medium">End Date</Text>
                        <Text as="p" size="1">Determine when this schedule stops</Text>
                      </Box>
                    </Flex>

                    <TextField.Root type="date"
                                    value={state.schedule.endDate.toISOString().split("T")[0]}
                                    onChange={handleEndDateChange}
                    />
                  </Text>
                </Flex>

                {state.error &&
                  <Callout.Root role={"alert"} color={"crimson"}>
                    <Callout.Icon>
                      <ExclamationTriangleIcon/>
                    </Callout.Icon>
                    <Callout.Text>
                      {state.error.message}
                    </Callout.Text>
                  </Callout.Root>
                }
                <Flex/>
              </Flex>

              <ScheduleCalendar
                  scheduleId={state.schedule.id}
                  entries={state.schedule.entries}
                  setEntries={(entries: ScheduleEntry[]) => dispatch({
                    type: "SET_ENTRIES",
                    payload: entries
                  })}
                  shows={shows}
                  scheduleStart={state.schedule.startDate}
                  scheduleEnd={state.schedule.endDate}
              />
            </Flex>
        </Flex>

        { hasChanges &&
          <Box px="6" py="4" width="100%" position="sticky" bottom="0"
               style={{background: "var(--gray-2)", boxShadow: "var(--shadow-6)"}}>
            <Container size="4">
              <Flex gap="2" justify="end" align="center">
                <Text size="2" style={{width: "100%"}}>You have unsaved changes</Text>
                <Button variant="soft"
                        color="gray"
                        onClick={() => dispatch({type: "RESET_SCHEDULE"})}>
                  Revert changes
                </Button>
                <Button type={"button"}>Apply changes</Button>
              </Flex>

            </Container>
          </Box>
        }
      </>
  );
}