import Link from "next/link";
import {Card, ContextMenu, Flex, Text} from "@radix-ui/themes";
import {ArrowRightIcon, Pencil1Icon, TrashIcon} from "@radix-ui/react-icons";
import React from "react";
import {Schedule} from "@/modules/domain/model/Schedule";

export default function ScheduleCard({ schedule,
                                       openDeleteDialog
}: {
  schedule: Schedule,
  openDeleteDialog: (schedule: Schedule) => void
}) {
  return (
      <ContextMenu.Root>

        <ContextMenu.Trigger>
          <Card variant="classic" asChild>
            <Link href={`/scheduling/${schedule.id}/edit`}>
              <Flex direction="column" align="center" py="1" gap="2">
                <Text size="4" weight="medium">
                  {schedule.name}
                </Text>
                <Flex gap="2" align="center">
                  <Text size="2" weight="medium">
                    {schedule.startDate?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </Text>
                  <ArrowRightIcon />
                  <Text size="2" weight="medium">
                    {schedule.endDate?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </Text>
                </Flex>
              </Flex>
            </Link>
          </Card>
        </ContextMenu.Trigger>

        <ContextMenu.Content>
          <ContextMenu.Item asChild>
            <Link href={`/scheduling/${schedule.id}/edit`}>
              <Pencil1Icon /> Edit
            </Link>
          </ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item color="ruby" onClick={() => openDeleteDialog(schedule)}>
            <TrashIcon /> Delete
          </ContextMenu.Item>
        </ContextMenu.Content>

      </ContextMenu.Root>
  );
}