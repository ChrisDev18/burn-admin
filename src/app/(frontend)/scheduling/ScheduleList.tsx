"use client";

import {useState} from "react";
import {
  Box,
  Button,
  Flex, Heading, IconButton, Popover, Separator,
  Text,
} from "@radix-ui/themes";
import {PlusIcon, QuestionMarkCircledIcon} from "@radix-ui/react-icons";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {deleteRadioShowAction} from "@/app/api/radio-shows/radioShowAction";
import ScheduleCard from "@/app/(frontend)/components/ScheduleCard";
import DeleteScheduleDialog from "@/app/(frontend)/dialogs/DeleteScheduleDialog";
import {Schedule} from "@/modules/domain/model/Schedule";

export default function ScheduleList({ schedules }: { schedules: Schedule[] }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const router = useRouter();

  async function handleDelete(scheduleId: number) {
    const result = await deleteRadioShowAction(scheduleId);
    if (result.success) {
      router.refresh(); // revalidate the page to fetch updated data
    } else {
      alert(result.message ?? "Failed to delete schedule");
    }
  }

  function setDeleteDialogSchedule(schedule: Schedule) {
    setSelectedSchedule(schedule)
    setDeleteOpen(true)
  }

  const now = new Date();

  const upcoming = schedules.filter(schedule => schedule.startDate.getDate() > now.getDate())
  const active = schedules.filter(schedule =>
      schedule.startDate.getDate() < now.getDate() && schedule.endDate.getDate() > now.getDate()
  )
  const previous = schedules.filter(schedule => schedule.endDate.getDate() < now.getDate())


  return (
      <Flex maxWidth={"1136px"} width={"100%"} flexGrow={"1"} direction="column" gap="3">
        <Flex flexGrow={"1"} direction="column" gap="4" pb={"6"}>
          <Flex mt="6" gap="4" justify="between" align="center">
            <Heading size="3">Schedules</Heading>

            <Button asChild>
              <Link href={'/scheduling/new'} >
                <PlusIcon /> New schedule
              </Link>
            </Button>
          </Flex>

          <Flex gap="3" align="center" height="1em">
            <Separator size="1"/>
            <Text>Active</Text>
            <Popover.Root>
              <Popover.Trigger>
                <IconButton size="1" variant="ghost">
                  <QuestionMarkCircledIcon width="18" height="18" />
                </IconButton>
              </Popover.Trigger>
              <Popover.Content size="1" maxWidth="300px">
                <Text as="p" trim="both" size="1">
                  The currently active schedule that defines what shows appear as Now Playing on the website and app.
                </Text>
              </Popover.Content>
            </Popover.Root>
            <Separator size="4"/>
          </Flex>

          { active.map((schedule, i) =>
              <ScheduleCard
                  key={i}
                  schedule={schedule}
                  openDeleteDialog={setDeleteDialogSchedule}
              />
          ) }

          { active.length == 0 &&
            <Text align="center" color="gray" size="2">No active schedule</Text>
          }

          <Flex gap="3" align="center" height="1em">
            <Separator size="1"/>
            <Text>Upcoming</Text>
            <Popover.Root>
              <Popover.Trigger>
                <IconButton size="1" variant="ghost">
                  <QuestionMarkCircledIcon width="18" height="18" />
                </IconButton>
              </Popover.Trigger>
              <Popover.Content size="1" maxWidth="300px">
                <Text as="p" trim="both" size="1">
                  The schedules you have planned for the future.
                </Text>
              </Popover.Content>
            </Popover.Root>
            <Separator size="4"/>
          </Flex>

          { upcoming.map((schedule, i) =>
              <ScheduleCard key={i} schedule={schedule} openDeleteDialog={setDeleteDialogSchedule} /> )
          }

          { upcoming.length == 0 &&
            <Text align="center" color="gray" size="2">No upcoming schedules</Text>
          }

          <Flex gap="3" align="center" height="1em">
            <Separator size="4"/>
          </Flex>

          <Box flexGrow={"1"}></Box>

          <Flex gap="3" mt="4" align="center" height="1em">
            <Separator size="1"/>
            <Text>Previous</Text>
            <Separator size="4"/>
          </Flex>

          { previous.map((schedule, i) =>
              <ScheduleCard key={i} schedule={schedule} openDeleteDialog={setDeleteDialogSchedule} /> )
          }

          { upcoming.length == 0 &&
            <Text align="center" color="gray" size="2">No previous schedules</Text>
          }
        </Flex>

        {selectedSchedule && (
            <>
              <DeleteScheduleDialog
                  scheduleId={selectedSchedule.id}
                  open={deleteOpen}
                  onOpenChange={setDeleteOpen}
                  onConfirm={handleDelete}
              />
            </>
        )}
      </Flex>
  );
}