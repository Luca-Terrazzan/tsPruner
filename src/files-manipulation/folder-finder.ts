import { Logger } from '@logger/logger';
import { Dirent, readdirSync } from 'fs-extra';

export class FolderFinder {

  constructor(private readonly logger: Logger) { }

  public openFolder(folderPath: string, skipFolders: boolean = false): string[] {
    // Contains a list of filenames contained in the folder
    let folderContent: Dirent[];
    try {
      folderContent = readdirSync(folderPath, { withFileTypes: true });
    } catch (e) {
      this.logger.error('error while reading folder: ', e);
    }

    return this.filterFolder(folderContent, skipFolders);
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
