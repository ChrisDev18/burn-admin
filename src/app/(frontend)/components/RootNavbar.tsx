"use client"

import React from "react";
import {TabNav} from "@radix-ui/themes";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {SessionPayload} from "@/app/api/auth/session";
import {logoutAction} from "@/app/api/auth/logout/logoutAction";

export default function RootNavbar({session}: {session: SessionPayload | undefined}) {
  const pathname = usePathname();

  if (session) return (
      <TabNav.Root justify="end">
        <TabNav.Link asChild active={pathname === "/"}>
          <Link href="/">Home</Link>
        </TabNav.Link>
        <TabNav.Link asChild active={pathname === "/radio-shows"}>
          <Link href="/radio-shows">Radio Shows</Link>
        </TabNav.Link>
        <TabNav.Link asChild>
          <button onClick={logoutAction}>Log out</button>
        </TabNav.Link>
      </TabNav.Root>
  );

  else return (
      <TabNav.Root justify="end">
        <TabNav.Link asChild active={pathname === "/"}>
          <Link href="/">Home</Link>
        </TabNav.Link>
        <TabNav.Link asChild active={pathname === "/login"}>
          <Link href="/login">Log in</Link>
        </TabNav.Link>
      </TabNav.Root>
  );
}