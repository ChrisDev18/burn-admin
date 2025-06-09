import {Box, Button, Container, Flex, Heading, Strong, Table, Text, TextField} from "@radix-ui/themes";
import {DashboardIcon, MagnifyingGlassIcon, PlusIcon} from "@radix-ui/react-icons";
import {getSession} from "@/app/api/auth/session";
import {getAllRadioShows} from "@/app/lib/repositories/RadioShowRepository";
import {FrontendRadioShow} from "@/app/lib/types/RadioShow";

export default async function Home() {
  const session = await getSession();

  const radioShows = await getAllRadioShows();

  // const radioShows: FrontendRadioShow[] = [{
  //   id: 1,
  //   title: "idk",
  //   description: null,
  //   hosts: [],
  //   photo: null,
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // }]

  return (
      <Flex height="100%" direction="column" flexGrow="1">

        <Box>
          <Container size="4" height="100%" p="6" style={{backgroundColor: "var(--accent-3)", borderBottom: "1px solid var(--accent-6)"}}>
            <Flex align="center" gap="3" mb="4">
              <DashboardIcon style={{color: "var(--accent-11)"}} height={30} width={30}/>
              <Heading id="heading" style={{color: "var(--accent-11)"}}>Radio Shows</Heading>
            </Flex>
            <Flex direction="column" gap="1">
              <Text weight="medium" style={{color: "var(--accent-12)"}}>Create, edit, and delete Radio Shows</Text>
              <Text weight="medium" style={{color: "var(--accent-12)"}}>Manage each Radio Show’s recordings</Text>
            </Flex>
          </Container>
        </Box>

        <Container size="4" p="6">
          { radioShows.length === 0 ?
            <Flex direction="column" gap="3" flexGrow="1" height="100%" justify="center" align="center">
              <Text align="center" size="3">
                <Strong>You have no Radio Shows</Strong>
              </Text>
              {/*<EditShowDialog onSuccess={handleSuccess}>*/}
              <Button>
                <PlusIcon /> New show
              </Button>
              {/*</EditShowDialog>*/}
            </Flex>
              :
              <Flex direction="column" gap="3">
                <Flex justify="between">
                  <TextField.Root placeholder="Search shows...">
                    <TextField.Slot>
                      <MagnifyingGlassIcon height="15" width="15" />
                    </TextField.Slot>
                  </TextField.Root>

                  {/*<EditShowDialog onSuccess={handleSuccess}>*/}
                  <Button>
                    <PlusIcon /> New show
                  </Button>
                  {/*</EditShowDialog>*/}
                </Flex>

                <Table.Root variant="surface">
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Title*</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Photo</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Hosts</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>


                      <Table.Body>
                        {radioShows.toSorted((a, b) => a.title.localeCompare(b.title)).map((show, i) => (
                            <Table.Row key={i}>
                              <Table.RowHeaderCell>{show.id}</Table.RowHeaderCell>
                              <Table.Cell>{show.title}</Table.Cell>
                              <Table.Cell>{show.description}</Table.Cell>
                              <Table.Cell>{show.photo ?? "None"}</Table.Cell>
                              <Table.Cell>{show.hosts}</Table.Cell>
                              <Table.Cell>
                                {/*<EditShowDialog show={show} onSuccess={handleSuccess}>*/}
                                {/*  <IconButton size="1" color="gray" variant="soft" type="button">*/}
                                {/*    <Pencil1Icon/>*/}
                                {/*  </IconButton>*/}
                                {/*</EditShowDialog>*/}
                                {/*<DeleteShowDialog show_id={show.id} onSuccess={handleSuccess}>*/}
                                {/*  <IconButton size="1" color="crimson" variant="soft" type="button">*/}
                                {/*    <TrashIcon/>*/}
                                {/*  </IconButton>*/}
                                {/*</DeleteShowDialog>*/}
                              </Table.Cell>
                            </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
              </Flex>
          }
        </Container>

      </Flex>
  );
}
