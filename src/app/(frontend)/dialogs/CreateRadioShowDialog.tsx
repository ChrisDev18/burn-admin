'use client';

import React, { useState } from 'react';
import {
  Button,
  Dialog,
  Flex,
} from '@radix-ui/themes';
import CreateRadioShowForm from "@/app/(frontend)/forms/CreateRadioShowForm";

type Props = {
  children: React.ReactNode; // This will be the trigger button
};

export default function CreateRadioShowDialog({ children }: Props) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0); // Used to reset form by remounting

  const handleSuccess = () => {
    setOpen(false);       // Close dialog
    setFormKey(prev => prev + 1); // Reset form
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setFormKey(prev => prev + 1); // Reset form when closed
    }
  };

  return (
      <Dialog.Root open={open} onOpenChange={handleOpenChange}>
        <Dialog.Trigger>{children}</Dialog.Trigger>

        <Dialog.Content maxWidth="480px">
          <Dialog.Title>Create new Radio Show</Dialog.Title>

          <Flex direction="column" gap="4">
            <CreateRadioShowForm key={formKey} onSuccess={handleSuccess} />

            <Flex justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray" aria-label="Close">
                  Cancel
                </Button>
              </Dialog.Close>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
);
}