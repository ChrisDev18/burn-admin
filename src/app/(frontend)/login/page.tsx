import React from 'react';
import {Flex} from "@radix-ui/themes";
import LoginForm from "@/app/(frontend)/forms/LoginForm";

export default function LoginPage() {
  return (
      <Flex direction="column" flexGrow="1" align="center" justify="center" p="6">
        <LoginForm />
      </Flex>
  );
}