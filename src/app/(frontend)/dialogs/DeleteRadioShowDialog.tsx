"use client";

import {Dialog, Button, Flex} from "@radix-ui/themes";
import {ReactNode} from "react";

interface DeleteRadioShowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showId: number;
  onConfirm: (id: number) => void;
}

export default function DeleteRadioShowDialog({open, onOpenChange, showId, onConfirm}: DeleteRadioShowDialogProps) {
  return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        {/*<Dialog.Trigger>*/}
        {/*  {children}*/}
        {/*</Dialog.Trigger>*/}

        <Dialog.Content maxWidth="400px">
          <Dialog.Title>Confirm deletion</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Are you sure you want to delete this radio show? This action cannot be undone.
          </Dialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button color="red" onClick={() => onConfirm(showId)}>
                Delete
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
  );
}