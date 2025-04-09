import { Router } from "express";
import { zSchemaValidator } from "@/middleware";
import { TestController } from "./test.controller";
import validator from "./test.validator";

export const test_rotues = Router();

test_rotues.get(
  "/",
  zSchemaValidator(validator.testSchema),
  TestController.test
);
