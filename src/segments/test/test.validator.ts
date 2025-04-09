import { z } from "zod";

const testSchema = z.object({
  body: z.object({
    key: z
      .string({ required_error: "Key is required" })
      .min(8, { message: "Key must be at least 8 characters long" })
      .max(16, { message: "Key must be at most 16 characters long" }),
    key2: z
      .string({ required_error: "Key2 is required" })
      .min(16, { message: "Key must be at least 16 characters long" })
      .max(30, { message: "Key must be at most 20 characters long" }),
  }),
});

const validator = {
  testSchema,
};

export default validator;
