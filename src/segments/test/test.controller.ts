import { AppError, sendResponse, session, tcWrapper } from "@/shared";
import mongoose from "mongoose";

export class TestController {
  static test = tcWrapper(async (req, res) => {
    // console.log(req.body);

    // let _id = new mongoose.Types.ObjectId();
    // session.create(res, { _id });

    // // session.destroy(res);

    // const retrive = session.retrieve(req, res);

    // console.log(retrive);

    // if (retrive) {
    //   console.log({ retrive });
    // } else {
    //   console.log({ retrive });
    // }

    // throw new AppError(500, "Custom made Server Error");

    sendResponse(res, { status: 200, success: true, message: "Test response" });
  });
}
