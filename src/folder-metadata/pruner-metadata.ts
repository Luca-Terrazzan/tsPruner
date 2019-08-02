import { readJsonSync, writeFileSync } from 'fs-extra';

import { FolderFinder } from '../files-manipulation/folder-finder';
import { Logger } from '../logging/logger';
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

  public getMetadata() {
    if (!this.folderMetadata) {
      this.folderMetadata = this.generateFolderMetadata();
    }

    return this.folderMetadata;
  }

  public generateFolderMetadata(): FolderMetadata {
    // Load existing metadata, if any
    let existingFolderMetadata: FolderMetadata;
    try {
      existingFolderMetadata = this.loadRawMetadata();
    } catch (error) {
      if (error instanceof MetadataNotFoundException) {
        existingFolderMetadata = this.generateEmptyMetadata();
      } else {
        throw error;
      }
    }

    // Get metadata for current folder content
    const currentFolderMetadata: FolderMetadata = this.generateMetadata();

    // Update metadata file
    const newMetadataFile: FolderMetadata =
      this.updateMetadataFile(existingFolderMetadata, currentFolderMetadata);

    // Save new metadata file if needed
    this.saveMetadataFile(newMetadataFile);

    return newMetadataFile;
  }

  private updateMetadataFile(oldMetadata: FolderMetadata, newMetadata: FolderMetadata): FolderMetadata {
    for (const oldFileData of oldMetadata.files) {
      // Get newest file metadata
      const newFileData = newMetadata.files.get(oldFileData[0]);

      // If there is no newer metadata the file is deleted, do nothing
      if (!newFileData) {
        continue;
      }

      // Else update the timestamp with the old one
      newFileData.timestamp = oldFileData[1].timestamp;
    }

    return newMetadata;
  }

  private saveMetadataFile(folderMetadata: FolderMetadata): void {
    // Maps cannot be json stringified, we need to convert everything to arrays
    const mapVoidMetadata = {
      files: Array.from(folderMetadata.files),
      timestamp: folderMetadata.timestamp
    };
    writeFileSync(
      `${this.ffinder.getFolderPath()}/${metadataFileName}`,
      JSON.stringify(mapVoidMetadata)
    );
  }

  /**
   * Generate a metadata file for a list of files
   *
   * @param filesList The file list to put in the metadata
   */
  private generateMetadata(): FolderMetadata {
    const now = Date.now();
    const folderMetadata: FolderMetadata = this.generateEmptyMetadata();

    for (const fileName of this.ffinder.openFolder()) {
      // Save file in metadata but skip the metadata itself
      if (fileName !== metadataFileName) {
        folderMetadata.files.set(
          fileName,
          { fileName, timestamp: now }
        );
      }
    }

    return folderMetadata;
  }

  private generateEmptyMetadata(): FolderMetadata {
    const now = Date.now();
    return {
      files: new Map<string, FileMetadata>(),
      timestamp: now
    };
  }

  /**
   * @throws FolderNotFoundException
   * @throws InvalidMetadataException
   */
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
      Logger.error('Invalid metadata file found.');
      throw new InvalidMetadataException();
    }

    if (!this.validateMetadataFile(folderMetadata)) {
      throw new InvalidMetadataException();
    }

    return folderMetadata;
  }

  /**
   * @throws FolderNotFoundException
   */
  private isMetadataFileExisting() {
    return this.ffinder.openFolder().includes(metadataFileName);
  }

  private validateMetadataFile(metadata: FolderMetadata): metadata is FolderMetadata {
    if (!metadata.timestamp || !metadata.files) {
      return false;
    }
    for (const fileMetadata of metadata.files) {
      if (!this.validateSingleFileMetadata(fileMetadata[1])) {
        return false;
      }
    }

    return true;
  }

  private validateSingleFileMetadata(metadata: FileMetadata): metadata is FileMetadata {
    return !(!metadata.fileName || !metadata.timestamp);
  }

}
