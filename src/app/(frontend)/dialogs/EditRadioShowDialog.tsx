'use client';

import React from 'react';
import {Button, Dialog, Flex} from '@radix-ui/themes';
import EditRadioShowForm from "@/app/(frontend)/forms/EditRadioShowForm";
import {FrontendRadioShow} from "@/app/lib/types/RadioShow";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  radioShow: FrontendRadioShow;
  onSuccess?: () => void;
};

export default function EditRadioShowDialog({ open, onOpenChange, radioShow, onSuccess }: Props) {
  return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
          <Dialog.Content maxWidth="480px">
            <Dialog.Title>Edit Radio Show</Dialog.Title>

            <Flex direction="column" gap="4">
              <EditRadioShowForm
                  radioShow={radioShow}
                  onSuccess={() => {
                    onOpenChange(false);
                    onSuccess?.();
                  }}
              />

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