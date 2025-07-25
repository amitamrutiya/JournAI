import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { sendSuccess, sendError } from "../utils/responses";
import { log } from "../utils/logger";

export const handleClerkWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type, data } = req.body;
    const userId = data?.id;

    log.info(`Processing webhook event: ${type} for user: ${userId}`);

    switch (type) {
      case "user.created":
        await handleUserCreated(data);
        break;
      case "user.updated":
        await handleUserUpdated(data);
        break;
      case "user.deleted":
        await handleUserDeleted(data);
        break;
      default:
        log.warn(`Unhandled webhook event type: ${type}`);
        return sendError(res, "Unhandled webhook event type", 400);
    }

    sendSuccess(
      res,
      { eventType: type, userId },
      "Webhook processed successfully"
    );
  } catch (error) {
    log.error(
      "Webhook processing failed",
      error instanceof Error ? error : new Error(String(error))
    );
    sendError(res, "Webhook processing failed", 500);
  }
};

const handleUserCreated = async (userData: any): Promise<void> => {
  const userCreateData = {
    id: userData.id,
    email: userData.email_addresses?.[0]?.email_address || "",
    name:
      `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
      "Unknown",
  };

  await UserService.createUser(userCreateData);
  log.info(
    `User created successfully: ${userData.id} (${userCreateData.email})`
  );
};

const handleUserUpdated = async (userData: any): Promise<void> => {
  const userUpdateData = {
    email: userData.email_addresses?.[0]?.email_address || "",
    name:
      `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
      "Unknown",
  };

  await UserService.updateUser(userData.id, userUpdateData);
  log.info(`User updated successfully: ${userData.id}`);
};

const handleUserDeleted = async (userData: any): Promise<void> => {
  await UserService.deleteUser(userData.id);
  log.info(`User deleted successfully: ${userData.id}`);
};
