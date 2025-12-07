import {Button, Container, Flex, Strong, Text} from "@radix-ui/themes";
import {DashboardIcon, PlusIcon} from "@radix-ui/react-icons";
import {getSession} from "@/app/api/auth/session";
import {getAllRadioShows} from "@/app/lib/repositories/RadioShowRepository";
import {redirect} from "next/navigation";
import Link from "next/link";
import RadioShowsTable from "@/app/(frontend)/radio-shows/RadioShowTable";
import PageHero from "@/app/(frontend)/components/PageHero";

export default async function RadioShowsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
    return (
        <p>Idk</p>
    );
  }

  const radioShows = await getAllRadioShows();

  return (
      <Flex height="100%" direction="column" align={"center"} flexGrow="1">

        <PageHero layout={"main"} title={"Radio Shows"} messages={[
          "Create, edit, and delete Radio Shows",
          "Manage each Radio Show’s recordings"
        ]} Icon={DashboardIcon} />

        <Flex direction="column" align="center" width="100%" p="6">
          <Flex width="100%" maxWidth="1136px">
            {radioShows.length === 0 ? (
                <Flex
                    direction="column"
                    gap="3"
                    flexGrow="1"
                    height="100%"
                    justify="center"
                    align="center"
                >
                  <Text align="center" size="3">
                    <Strong>You have no Radio Shows</Strong>
                  </Text>
                  <Button asChild>
                    <Link href={"/radio-shows/new"}>
                      <PlusIcon /> New show
                    </Link>
                  </Button>

                  <Button asChild>
                    <Link href={"/radio-shows/import"}>
                      <PlusIcon /> Import from file
                    </Link>
                  </Button>
                </Flex>
            ) : (
                <RadioShowsTable radioShows={radioShows} />
            )}
          </Flex>
        </Flex>

      </Flex>
  );
}
