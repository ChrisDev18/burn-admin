import {Text, Box, Container, Flex, Heading} from "@radix-ui/themes";
import {getSession} from "@/app/api/auth/session";
import {redirect} from "next/navigation";
import ScheduleList from "@/app/(frontend)/scheduling/ScheduleList";
import {getAllSchedules} from "@/app/lib/repositories/ScheduleRepository";
import {ActivityLogIcon} from "@radix-ui/react-icons";
import PageHero from "@/app/(frontend)/components/PageHero";

export default async function SchedulingPage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
    return (
        <p>Idk</p>
    );
  }

  const schedules = await getAllSchedules();

  return (
      <Flex height="100%" direction="column" align={"center"} flexGrow="1">

        <PageHero layout={"main"} title={"Scheduling"} messages={[
            "Define weekly schedules and add or remove Shows",
            "Override regular schedule behaviour with exceptions"
        ]} Icon={ActivityLogIcon} />

        <Flex width={"100%"} px="6" direction={"column"} align={"center"} height={"100%"} flexGrow={"1"}>
          <ScheduleList schedules={schedules} />
        </Flex>

      </Flex>
  );
}
