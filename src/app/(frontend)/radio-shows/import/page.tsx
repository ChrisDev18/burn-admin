"use client"
import React from 'react';
import {Flex} from "@radix-ui/themes";
import CreateRadioShowForm from "@/app/(frontend)/forms/CreateRadioShowForm";
import {redirect} from "next/navigation";
import ImportRadioShowsForm from "@/app/(frontend)/forms/ImportRadioShowsForm";

export default function ImportRadioShowsPage() {
  return (
      <Flex direction="column" flexGrow="1" align="center" justify="center" p="6">
        <ImportRadioShowsForm onSuccess={() => redirect("/radio-shows")} />
      </Flex>
  );
}