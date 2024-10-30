import { NoteHistory } from "@/client/features/notes/note-history";
import { Title } from "@mantine/core";

export default function Page() {
  return (
    <>
      <Title mb="md">Note history</Title>

      <NoteHistory />
    </>
  );
}
