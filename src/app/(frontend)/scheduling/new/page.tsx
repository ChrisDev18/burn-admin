"use client"
import React from 'react';
import {Flex} from "@radix-ui/themes";
import CreateRadioShowForm from "@/app/(frontend)/forms/CreateRadioShowForm";
import {redirect} from "next/navigation";

export default function CreateSchedulePage() {
  return (
      <Flex direction="column" flexGrow="1" align="center" justify="center" p="6">
        {/*<CreateRadioShowForm onSuccess={() => redirect("/radio-shows")} />*/}
      </Flex>
  );
}