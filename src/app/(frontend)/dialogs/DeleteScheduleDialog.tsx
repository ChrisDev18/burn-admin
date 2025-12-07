"use client";

import {Dialog, Button, Flex} from "@radix-ui/themes";

interface DeleteScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduleId: number;
  onConfirm: (id: number) => void;
}

export default function DeleteScheduleDialog({open, onOpenChange, scheduleId, onConfirm}: DeleteScheduleDialogProps) {
  return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content maxWidth="400px">
          <Dialog.Title>Confirm deletion</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Are you sure you want to delete this schedule? This action cannot be undone.
          </Dialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button color="red" onClick={() => onConfirm(scheduleId)}>
                Delete
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
  );
}