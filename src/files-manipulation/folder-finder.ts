import { Logger } from '@logger/logger';
import { Dirent, readdirSync } from 'fs-extra';
import { FolderNotFoundException } from './exceptions';

export class FolderFinder {

  private folderContent: string[];

  constructor(
    private readonly folderPath: string
  ) { }

  /**
   * Opens a folder and returns a list of filenames inside it.
   * Can skip subfolders.
   *
   * @param folderPath Path to folder to open
   * @param skipFolders True to skip reading sub folders
   *
   * @throws FolderNotFoundException
   */
  public openFolder(skipFolders: boolean = false): string[] {
    if (this.folderContent) {
      return this.folderContent;
    }

    // Contains a list of filenames contained in the folder
    let folderContent: Dirent[];
    try {
      folderContent = readdirSync(this.folderPath, { withFileTypes: true });
    } catch (e) {
      Logger.error('error while reading folder: ', e);
      throw new FolderNotFoundException();
    }
    // Filter and save folder contents
    this.folderContent = this.filterFolder(folderContent, skipFolders);

    return this.folderContent;
  }

  public getFolderPath(): string {
    return this.folderPath;
  }

  private filterFolder(contents: Dirent[], skipFolders: boolean): string[] {
    const filteredContents: string[] = [];
    for (const file of contents) {
      // Skip folders if they are being filtered out
      if (skipFolders && file.isDirectory()) {
        continue;
      }

      // Add to selected contents
      filteredContents.push(file.name);
    }

    return filteredContents;
  }

}
