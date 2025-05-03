import type { Prisma } from '@prisma/client'

import type { GraphQLResolveInfo } from 'graphql'
import type { ClerkClaims } from '../auth/types'
import type { GoogleStorageService } from '../google-storage/google-storage.service'

import type { FileService } from './file.service'
import {
  Args,
  Field,
  Info,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql'
import { ClerkContext } from '../auth/decorators/clerk-context.decorator'
import { File, FileCreateManyInput } from '../generated/graphql'
import { GCPUploadFile } from '../google-storage/google-storage.dto'
import { PrismaSelect } from '../utilities/prisma/prisma-select'

@ObjectType()
class SignedUrlsForUploadPayload {
  @Field(() => [String])
  uploadUrls: string[]
}

@ObjectType()
class SignedUrlsForDownloadPayload {
  @Field(() => [String])
  downloadUrls: string[]
}

@Resolver()
export class FileResolver {
  constructor(
    private readonly googleStorageService: GoogleStorageService,
    private readonly fileService: FileService,
  ) {}

  @Mutation(() => [File], {
    name: 'createFiles',
  })
  async createFiles(
    @ClerkContext()
    clerkContext: ClerkClaims,
    @Info()
    info: GraphQLResolveInfo,
    @Args('data', { type: () => [FileCreateManyInput] })
    data: FileCreateManyInput[],
  ): Promise<File[]> {
    const { select } = new PrismaSelect<Prisma.FileSelect>(info).value

    return this.fileService.createAndProcessFiles({
      data,
      select,
    })
  }

  @Query(() => SignedUrlsForUploadPayload, {
    description: 'Get file upload url',
    name: 'generateSignedUrlsForUpload',
  })
  async generateSignedUrlsForUpload(
    @Args('files', { type: () => [GCPUploadFile] })
    files: GCPUploadFile[],
  ): Promise<SignedUrlsForUploadPayload> {
    const uploadUrls
      = await this.googleStorageService.generateSignedUrlsForUpload(files)
    return { uploadUrls }
  }

  @Query(() => SignedUrlsForDownloadPayload, {
    description: 'Get file download url',
    name: 'genrerateSignedUrlsForDownload',
  })
  async genrerateSignedUrlsForDownload(
    @Args('gcpFileNames', { type: () => [String] })
    gcpFileNames: string[],
  ): Promise<SignedUrlsForDownloadPayload> {
    const downloadUrls
      = await this.googleStorageService.generateSignedUrlsForDownload(
        gcpFileNames,
      )
    return { downloadUrls }
  }
}
