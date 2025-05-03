import type { ConfigService } from '@nestjs/config'
import type { GCPUploadFile } from './google-storage.dto'
import { Storage } from '@google-cloud/storage'

import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class GoogleStorageService {
  private readonly logger = new Logger(GoogleStorageService.name)
  private storage
  private bucketName: string

  constructor(private configService: ConfigService) {
    this.storage = new Storage()
    this.bucketName
      = this.configService.get<string>('GCS_LOTS_BUCKET_NAME') ?? ''
  }

  async getGCPFileAsString({
    gcpFileName,
  }: {
    gcpFileName: string
  }): Promise<string> {
    const [contents] = await this.storage
      .bucket(this.bucketName)
      .file(gcpFileName)
      .download()
    return contents.toString('utf8')
  }

  // Generate signed URL for file upload
  async generateSignedUrlsForUpload(files: GCPUploadFile[]): Promise<string[]> {
    const bucket = this.storage.bucket(this.bucketName)
    const bucketFiles = files.map(file => bucket.file(file.fileName))
    const urls = await Promise.all(
      bucketFiles.map((file, i) =>
        file.getSignedUrl({
          action: 'write',
          contentType: files[i].type,
          expires: Date.now() + 5 * 60 * 1000,
        }),
      ),
    )

    return urls.map(([url]) => url)
  }

  // Generate signed URL for file download
  async generateSignedUrlsForDownload(fileNames: string[]): Promise<string[]> {
    const bucket = this.storage.bucket(this.bucketName)
    const files = fileNames.map(fileName => bucket.file(fileName))

    const urls = await Promise.all(
      files.map(file =>
        file.getSignedUrl({
          action: 'read', // Action is 'read' for downloads
          expires: Date.now() + 5 * 60 * 1000, // URL expires in 5 minutes
        }),
      ),
    )

    return urls.map(([url]) => url)
  }
}
