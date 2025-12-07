import {Recording as PrismaRecording} from "@prisma/client";

export type Recording = {
  id: number;
  radioShowId: number;
  recording: string;
  title: string | null;
  recordedAt: Date;
};

export const mapRecording = (rec: PrismaRecording): Recording => ({
  id: rec.id,
  radioShowId: rec.radioShowId,
  recording: rec.recording,
  title: rec.title,
  recordedAt: rec.recordedAt,
});