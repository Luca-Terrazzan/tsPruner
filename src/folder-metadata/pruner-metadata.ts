import { FolderFinder } from '@finder/folder-finder';
import { Logger } from '@logger/logger';
import { readJsonSync } from 'fs-extra';
import { InvalidMetadataException, MetadataNotFoundException } from './exceptions';
import { FileMetadata, FolderMetadata } from './folder-metadata.type';

export const metadataFileName: string = 'prune-metadata.json';

/**
 * A service to handle folder metadata creation and update
 */
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

  /**
   * Generate a metadata file for a list of files
   *
   * @param filesList The file list to put in the metadata
   */
  public generateMetadata(filesList: string[]): boolean {
    return true;
  }

  /**
   * Reads metadata from a folder
   */
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
        throw new InvalidMetadataException();
      }
      this.logger.error('Metadata file not found.');
      throw new MetadataNotFoundException();
    }
    this.validateMetadataFile(folderMetadata);

    return folderMetadata;
  }

  private validateMetadataFile(metadata: FolderMetadata): void {
    if (!this.determineIfIsValidMetadataFormat(metadata)) {
      throw new InvalidMetadataException();
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
