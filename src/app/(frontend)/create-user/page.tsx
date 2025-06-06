import React from 'react';
import {Flex} from "@radix-ui/themes";
import CreateUserForm from "@/app/(frontend)/forms/CreateUserForm";

export default function CreateUserPage() {
  return (
      <Flex direction="column" flexGrow="1" align="center" justify="center" p="6">
        <CreateUserForm />
      </Flex>
  );
}