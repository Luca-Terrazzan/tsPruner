import { readdirSync } from 'fs';

export class FolderFinder {

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
