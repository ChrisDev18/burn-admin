"use client";

import {useState, useMemo} from "react";
import {
  Badge,
  Button,
  ContextMenu,
  Flex,
  Table,
  Text,
  TextField
} from "@radix-ui/themes";
import {FileIcon, MagnifyingGlassIcon, PlusIcon, UploadIcon} from "@radix-ui/react-icons";
import Link from "next/link";
import Image from "next/image";
import {FrontendRadioShow} from "@/app/lib/types/RadioShow";
import {useRouter} from "next/navigation";
import {deleteRadioShowAction} from "@/app/api/radio-shows/radioShowAction";
import DeleteRadioShowDialog from "@/app/(frontend)/dialogs/DeleteRadioShowDialog";
import EditRadioShowDialog from "@/app/(frontend)/dialogs/EditRadioShowDialog";

export default function RadioShowsTable({radioShows}: {radioShows: FrontendRadioShow[]}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [selectedShow, setSelectedShow] = useState<FrontendRadioShow | null>(null);

  const filteredShows = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return radioShows.filter(show =>
        show.title.toLowerCase().includes(term) ||
        (show.description?.toLowerCase().includes(term) ?? false) ||
        show.hosts.some(h => h.toLowerCase().includes(term))
    );
  }, [searchTerm, radioShows]);

  // inside component
  const router = useRouter();

  async function handleDelete(showId: number) {
    const result = await deleteRadioShowAction(showId);
    if (result.success) {
      router.refresh(); // revalidate the page to fetch updated data
    } else {
      alert(result.message ?? "Failed to delete show");
    }
  }

  async function handleUpdate() {
    // if (result.success) {
      router.refresh(); // revalidate the page to fetch updated data
    // } else {
    //   alert(result.message ?? "Failed to delete show");
    // }
  }

  return (
      <Flex width="100%" direction="column" gap="3">
        <Flex justify="between" gap="3">
          <TextField.Root
              style={{ width: "40%" }} // 👈 responsive full width
              placeholder="Search for shows by title, description, host"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="15" width="15" />
            </TextField.Slot>
          </TextField.Root>

          <Flex gap="3">
            <Button asChild>
              <Link href={"/radio-shows/import"}>
                <UploadIcon /> Import Shows
              </Link>
            </Button>

            <Button asChild>
              <Link href={"/radio-shows/new"}>
                <PlusIcon /> New show
              </Link>
            </Button>
          </Flex>
        </Flex>

        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Title*</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Photo</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Hosts</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredShows
                .toSorted((a, b) => a.title.localeCompare(b.title))
                .map((show) => (
                      <ContextMenu.Root key={show.id}>
                        <ContextMenu.Trigger>
                          <Table.Row>
                            <Table.RowHeaderCell>{show.id}</Table.RowHeaderCell>
                            <Table.Cell>{show.title}</Table.Cell>
                            <Table.Cell>
                              {show.description ?? (
                                  <Text color="gray">
                                    <em>None</em>
                                  </Text>
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              {show.photo ? (
                                  <Image src={show.photo} alt="" width={50} height={50} style={{borderRadius: 4}} />
                              ) : (
                                  <Text color="gray">
                                    <em>None</em>
                                  </Text>
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              {!show.hosts.length ? (
                                  <Text color="gray">
                                    <em>None</em>
                                  </Text>
                              ) : (
                                  <Flex wrap="wrap" gap="1">
                                    {show.hosts.map((host, i) => (
                                        <Badge key={i}>{host}</Badge>
                                    ))}
                                  </Flex>
                              )}
                            </Table.Cell>
                          </Table.Row>
                        </ContextMenu.Trigger>

                        <ContextMenu.Content>
                          <ContextMenu.Item
                              onSelect={() => {
                                setSelectedShow(show);
                                setEditOpen(true);
                              }}
                              shortcut="⌘ E"
                          >
                            Edit
                          </ContextMenu.Item>
                          <ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>
                          <ContextMenu.Separator />
                          <ContextMenu.Item
                              onSelect={() => {
                                setSelectedShow(show);
                                setDeleteOpen(true);
                              }}
                              shortcut="⌘ ⌫"
                              color="red"
                          >
                            Delete
                          </ContextMenu.Item>
                        </ContextMenu.Content>
                      </ContextMenu.Root>
                ))}
          </Table.Body>
        </Table.Root>

        { selectedShow && (
            <>
              <DeleteRadioShowDialog
                  showId={selectedShow.id}
                  open={deleteOpen}
                  onOpenChange={setDeleteOpen}
                  onConfirm={handleDelete}
              />
              <EditRadioShowDialog
                  open={editOpen}
                  onOpenChange={setEditOpen}
                  radioShow={selectedShow}
                  onSuccess={handleUpdate}
              />
            </>
        )}
      </Flex>
  );
}