import {Flex} from "@radix-ui/themes";
import {getSession} from "@/app/api/auth/session";
import {notFound, redirect} from "next/navigation";
import {getScheduleByIdWithEntries} from "@/app/lib/repositories/ScheduleRepository";
import EditScheduleView from "@/app/(frontend)/scheduling/[scheduleId]/edit/EditScheduleView";
import {getAllRadioShows} from "@/app/lib/repositories/RadioShowRepository";

export default async function EditSchedulePage({ params }: { params: Promise<{ scheduleId: string }> }) {
  const session = await getSession();

  if (!session) {
    redirect("/");
    return (
        <p>Idk</p>
    );
  }

  // Convert to number
  const scheduleId = Number((await params).scheduleId);

  if (Number.isNaN(scheduleId)) {
    return notFound();
  }

  const schedule = await getScheduleByIdWithEntries(scheduleId);
  const shows = await getAllRadioShows();


  if (schedule === null) {
    return notFound()
  }

  return (
      <Flex height="100%" direction="column" align={"center"} flexGrow="1">
        <EditScheduleView shows={shows} originalSchedule={schedule} />
      </Flex>
  );
}
