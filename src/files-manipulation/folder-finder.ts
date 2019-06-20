import { readdirSync } from 'fs';
import { Logger } from '../logging/logger';

export class FolderFinder {

  constructor(private readonly logger: Logger) { }

  public openFolder(folderPath: string): string[] {
    // Contains a list of filenames contained in the folder
    let folderContent: string[];
    try {
      folderContent = readdirSync(folderPath);
    } catch (e) {
      console.log('error while reading file:', e);
    }

    return folderContent;
  }

}
