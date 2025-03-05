import { z } from "zod";

export const GCPUploadFileSchema = z.object({
  fileName: z.string(),
  type: z.string(),
});

export type GCPUploadFile = z.infer<typeof GCPUploadFileSchema>;
