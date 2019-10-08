import { FolderMetadata } from 'folder-metadata/folder-metadata.type';

/**
 * Performs actions on files based upon their metadata
 * e.g. deletes files older than set validity
 */
export class Dater {

  constructor(private readonly folderMetadata: FolderMetadata) { }

  public deleteFilesOlderThan(days: number): void {
    for (const file of this.folderMetadata.files) {
      if (this.determineAge(file[1].timestamp, this.folderMetadata.timestamp) > days) {
        console.log('deleting file', file[1].fileName);

        file[1].fileName = 'deleted';
      }
    }
  }

  /**
   * Returns the portions of days between two timestamps
   */
  private determineAge(firstTimestamp: number, secondTimestamp: number): number {
    return (secondTimestamp - firstTimestamp) / 1000 / 3600 / 24;
  }

}
