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

  private folderMetadata: FolderMetadata;

  constructor(
    private readonly ffinder: FolderFinder
  ) { }

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
    if (!this.folderMetadata) {
      this.folderMetadata = this.loadRawMetadata();
    }

    return this.folderMetadata;
  }

  private loadRawMetadata(): FolderMetadata {
    if (!this.isMetadataFileExisting()) {
      Logger.error('Metadata file not found.');
      throw new MetadataNotFoundException();
    }

    let folderMetadata: FolderMetadata;
    try {
      folderMetadata = readJsonSync(
        `${this.ffinder.getFolderPath()}/${metadataFileName}`
      ) as FolderMetadata;
    } catch (e) {
      if (e instanceof SyntaxError) {
        Logger.error('Invalid metadata file found.');
        throw new InvalidMetadataException();
      }
    }
    this.validateMetadataFile(folderMetadata);

    return folderMetadata;
  }

  private isMetadataFileExisting() {
    return this.ffinder.openFolder().includes(metadataFileName);
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
