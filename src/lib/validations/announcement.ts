import { z } from "zod";

export const AnnouncementSchema = z.object({
  companyid: z
    .string({ required_error: "Company ID is required." })
    .min(1, { message: "Company ID must be provided." }),
  title: z
    .string({ required_error: "Title is required." })
    .min(3, { message: "Title must be at least 3 characters long." }),
  content: z
    .string({ required_error: "Content is required." })
    .min(10, { message: "Content must be at least 10 characters long." }),
  isactive: z.boolean().default(true), // Default to active if not provided
  startdate: z.string().optional(), // Optional ISO date string
  enddate: z.string().optional(), // Optional ISO date string
});

// Schema for creating an announcement with only required fields
export const createAnnouncementSchema = AnnouncementSchema.pick({
  companyid: true,
  title: true,
  content: true,
  isactive: true,
  startdate: true,
  enddate: true,
});

export type AnnouncementData = z.infer<typeof AnnouncementSchema>;
export type CreateAnnouncementData = z.infer<typeof createAnnouncementSchema>;
