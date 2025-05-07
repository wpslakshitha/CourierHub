import { Request, Response, NextFunction } from "express";

export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`Error: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  next(err);
};

export const errorResponder = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header("Content-Type", "application/json");

  res.status(500).json({
    success: false,
    message: "Server error occurred",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
};

export const invalidPathHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Invalid path",
    error: "The requested resource does not exist",
  });
};
