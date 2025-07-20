import type { GraphQLResolveInfo } from 'graphql'
import type { ClerkClaims } from '../auth/types'
import {
  Args,
  Field,
  Info,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { ClerkContext } from '../auth/decorators/clerk-context.decorator'
import { File, FileCreateManyInput, FileType } from '../generated/graphql'
import { GCPUploadFile } from '../google-storage/google-storage.dto'
import { GoogleStorageService } from '../google-storage/google-storage.service'
import { PrismaSelect } from '../utilities/prisma/prisma-select'
import { FileService } from './file.service'

export @InputType()
class InitFileUploadPayload {
  @Field(() => String)
  gcpFilename: string

  @Field(() => String)
  displayName: string

  @Field(() => String)
  type: string

  @Field(() => FileType)
  fileType: FileType
}

export @InputType()
class InitAccountFileUploadPayload {
  @Field(() => String)
  name: string

  @Field(() => Number)
  deferredLoss: number

  @Field(() => Number)
  dividend: number

  @Field(() => Number)
  longTerm: number

  @Field(() => Number)
  shortTerm: number

  @Field(() => String, { nullable: true })
  description?: string
}

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

@ObjectType()
class InitAccountFileUploadResponse {
  @Field(() => [File])
  files: File[]

  @Field(() => String)
  accountId: string
}

@Resolver()
export class FileResolver {
  constructor(
    private readonly googleStorageService: GoogleStorageService,
    private readonly fileService: FileService,
  ) { }

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
      portfolioId: clerkContext.metadata.portfolioId,
    })
  }

  @Mutation(() => InitAccountFileUploadResponse, {
    name: 'initAccountFileUpload',
  })
  async initAccountFileUpload(
    @ClerkContext()
    clerkContext: ClerkClaims,
    @Info()
    info: GraphQLResolveInfo,
    @Args('fileData', { type: () => [InitFileUploadPayload] })
    fileData: InitFileUploadPayload[],
    @Args('accountData', { type: () => InitAccountFileUploadPayload })
    accountData: InitAccountFileUploadPayload,
  ): Promise<InitAccountFileUploadResponse> {
    const result = await this.fileService.initAccountFileUpload({
      accountCreateInput: {
        name: accountData.name,
        description: accountData.description,
        createdBy: { connect: { id: clerkContext.sub } },
        portfolio: { connect: { id: clerkContext.metadata.portfolioId } },
        realizedPAndL: {
          create: [{
            deferredLoss: accountData.deferredLoss.toString(),
            dividend: accountData.dividend.toString(),
            longTerm: accountData.longTerm.toString(),
            shortTerm: accountData.shortTerm.toString(),
            year: new Date().getFullYear(),
            portfolioId: clerkContext.metadata.portfolioId,
          }],
        },
      },
      fileData,
      portfolioId: clerkContext.metadata.portfolioId,
      userId: clerkContext.sub,
    })
    return result
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
