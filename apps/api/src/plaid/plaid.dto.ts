import { z } from "zod";

export const PlaidInstitutionSchema = z.object({
  name: z.string(),
  institution_id: z.string(),
});

export type PlaidInstitution = z.infer<typeof PlaidInstitutionSchema>;

export const PlaidAccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  mask: z.string(),
  type: z.string(),
  subtype: z.string().optional(),
  verification_status: z.string().optional(),
});

export type PlaidAccount = z.infer<typeof PlaidAccountSchema>;

export const PlaidLinkOnSuccessMetadataSchema = z.object({
  institution: PlaidInstitutionSchema.optional(),
  accounts: z.array(PlaidAccountSchema),
  link_session_id: z.string(),
  transfer_status: z.string().optional(),
});

export type PlaidLinkOnSuccessMetadata = z.infer<
  typeof PlaidLinkOnSuccessMetadataSchema
>;

export const LinkTokeOutputSchema = z.object({
  linkToken: z.string(),
});

export type LinkTokenOutput = z.infer<typeof LinkTokeOutputSchema>;
