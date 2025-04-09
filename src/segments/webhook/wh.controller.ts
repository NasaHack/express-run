import { sendResponse, tcWrapper } from "@/shared";

export class WebHook {
  static someExternelServices = tcWrapper(async (req, res) => {
    sendResponse(res, {
      status: 200,
      success: true,
      message: "I will fire when someone hits me",
    });
  });
}
