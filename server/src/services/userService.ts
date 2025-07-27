import db from "../db/db.config";
import { log } from "../utils/logger";

export interface ClerkUserData {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
}

export class UserService {
  static async createUser(userData: ClerkUserData): Promise<any> {
    try {
      log.debug(`Creating user: ${userData.id} (${userData.email})`);

      const user = await db.user.create({
        data: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          imageUrl: userData.imageUrl,
          journalIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      log.info(`User created: ${user.id}`);
      return user;
    } catch (error) {
      log.error(
        "Failed to create user",
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  static async updateUser(
    userId: string,
    updateData: Partial<ClerkUserData>
  ): Promise<any> {
    try {
      log.debug(`Updating user: ${userId}`);

      const user = await db.user.update({
        where: { id: userId },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
      });

      log.info(`User updated: ${userId}`);
      return user;
    } catch (error) {
      log.error(
        "Failed to update user",
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      log.debug(`Deleting user: ${userId}`);

      await db.user.delete({
        where: { id: userId },
      });

      log.info(`User deleted: ${userId}`);
    } catch (error) {
      log.error(
        "Failed to delete user",
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }
}
