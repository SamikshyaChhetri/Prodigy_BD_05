import { z } from "zod";
import { validateDate, validCuid } from "../../utils/utils.js";

export const schema = z.object({
  reserverId: z.string().refine(validCuid, { message: "Invalid reserver Id" }),
  listingId: z.string().refine(validCuid, { message: "Invalid listing Id" }),
  date: z.string().refine(validateDate, { message: "Invalid Date" }),
});
