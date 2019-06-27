import { FolderFinder } from '@finder/folder-finder';
import { Logger } from '@logger/logger';
import { readJsonSync } from 'fs-extra';
import { InvalidMetadataException, MetadataNotFoundException } from './exceptions';
import { FileMetadata, FolderMetadata } from './folder-metadata.type';

export const metadataFileName: string = 'prune-metadata.json';

export class PrunerMetadata {

  private readonly folderPath: string;
  private readonly folderMetadata: FolderMetadata;

  constructor(
    folderPath: string,
    private readonly ffinder: FolderFinder,
    private readonly logger: Logger
  ) {
    this.folderPath = folderPath;
  }

  public generateMetadata(filesList: string[]): boolean {
    return true;
  }

  public getFolderMetadata(): FolderMetadata {
    return this.loadRawMetadata();
  }

  private loadRawMetadata(): FolderMetadata {
    let folderMetadata: FolderMetadata;
    try {
      folderMetadata = readJsonSync(`${this.folderPath}/${metadataFileName}`) as FolderMetadata;
    } catch (e) {
      if (e instanceof SyntaxError) {
        this.logger.error('Invalid metadata file found.');
        throw new InvalidMetadataException('Invalid metadata file found.');
      }
      this.logger.error('Metadata file not found.');
      throw new MetadataNotFoundException('Metadata file not found.');
    }
    this.validateMetadataFile(folderMetadata);

    return folderMetadata;
  }

  private validateMetadataFile(metadata: FolderMetadata): void {
    if (!this.determineIfIsValidMetadataFormat(metadata)) {
      throw new InvalidMetadataException('Invalid metadata format.');
    }
  }

  private determineIfIsValidMetadataFormat(metadata: FolderMetadata): metadata is FolderMetadata {
    if (!metadata.timestamp || !metadata.files) {
      return false;
    }
    for (const fileMetadata of metadata.files) {
      if (!this.validateSingleFileMetadata(fileMetadata)) {
        return false;
      }
    }

    return true;
  }

  private validateSingleFileMetadata(metadata: FileMetadata): metadata is FileMetadata {
    return !(!metadata.fileName || !metadata.timestamp);
  }

}
