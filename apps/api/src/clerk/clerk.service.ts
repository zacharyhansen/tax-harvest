import { clerkClient } from '@clerk/clerk-sdk-node';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClerkService {
  constructor() {}

  updatePublicMetaData(
    clerkUserId: string,
    publicMetadata: UserPublicMetadata,
  ) {
    return clerkClient.users.updateUser(clerkUserId, {
      publicMetadata,
    });
  }

  user(id: string) {
    return clerkClient.users.getUser(id);
  }
}
