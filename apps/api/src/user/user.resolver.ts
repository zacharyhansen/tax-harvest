import { Args, Info, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Prisma } from "@prisma/client";
import { type GraphQLResolveInfo } from "graphql";

import { ClerkContext } from "../auth/decorators/clerk-context.decorator";
import { type ClerkClaims } from "../auth/types";
import { User, UserUpdateInput } from "../generated/graphql";
import { PrismaSelect } from "../utilities/prisma/prisma-select";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, {
    description: "Get current user",
    name: "userCurrent",
  })
  async user(
    @ClerkContext()
    clerkContext: ClerkClaims,
    @Info()
    info: GraphQLResolveInfo,
  ): Promise<User> {
    const { select } = new PrismaSelect<Prisma.UserSelect>(info).value;
    return this.userService.asserUserExists(clerkContext.sub, select);
  }

  @Mutation(() => User, {
    description: "Update User",
    name: "updateUser",
  })
  async updateUser(
    @ClerkContext()
    currentUser: ClerkClaims,
    @Info()
    info: GraphQLResolveInfo,
    @Args("data", { type: () => UserUpdateInput })
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    const { select } = new PrismaSelect<Prisma.UserSelect>(info).value;

    return await this.userService.updateUser({
      data,
      select,
      where: {
        id: currentUser.sub,
      },
    });
  }

  @Mutation(() => User, {
    description: "Update User Favorites",
    name: "updateUserFavorites",
  })
  async updateUserFavorites(
    @ClerkContext()
    currentUser: ClerkClaims,
    @Info()
    info: GraphQLResolveInfo,
    @Args("data", { type: () => UserUpdateInput })
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    const { select } = new PrismaSelect<Prisma.UserSelect>(info).value;
    // this.userService.user({
    //   select,
    //   where:{
    //     id: currentUser.sub
    //   },
    //   data: {

    //   }
    // })
    return await this.userService.updateUserFavorites({
      data,
      select,
      where: {
        id: currentUser.sub,
      },
    });
  }

  @Query(() => User, {
    description: "Find one user by email",
    name: "findOneUserByEmail",
  })
  async findOneUserByEmail(
    @Args("email", {
      type: () => String,
    })
    email: string,
  ): Promise<User> {
    return this.userService.findOneByEmail(email);
  }

  @Query(() => User, {
    description: "Get a user",
    name: "getUserPublic",
  })
  async getUserPublic(
    @Args("id", {
      nullable: false,
      type: () => String,
    })
    id: string,
  ): Promise<User> {
    return this.userService.findOneById(id);
  }

  @Mutation(() => User, {
    description: "Update a user",
    name: "updateUserById",
  })
  async updateUserById(
    @ClerkContext()
    clerkContext: ClerkClaims,
    @Args("updateUserInput", { type: () => UserUpdateInput })
    updateUserInput: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.userService.update({
      data: updateUserInput,
      where: {
        id: clerkContext.sub,
      },
    });
  }
}
