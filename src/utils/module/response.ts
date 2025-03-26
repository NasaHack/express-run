export const success = (status: number, message: string, data?: unknown) => {
  let resObj: {
    status: number;
    success: boolean;
    message: string;
    data?: any;
  } = {
    status,
    success: true,
    message,
  };
  data ? (resObj.data = data) : null;
  return resObj;
};

export const failed = (status: number, message: string, stack?: unknown) => {
  const resObj: {
    status: number;
    success: boolean;
    message: string;
    stack?: any;
  } = {
    status,
    success: false,
    message,
  };

  stack instanceof Error
    ? (resObj.stack = stack
        .toString()
        .split("\n")
        .map((line) => line.replace(/[\s] /gi, "")))
    : null;

  return resObj;
};
