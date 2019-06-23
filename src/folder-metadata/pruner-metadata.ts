import { FolderMetadata } from './folder-metadata.type';
import { readJsonSync } from 'fs-extra';
import { FolderFinder } from '../files-manipulation/folder-finder';
import { MetadataNotFoundException, InvalidMetadataException } from './exceptions';

export const metadataFileName: string = 'prune-metadata.json';

export class PrunerMetadata {

    private readonly folderPath: string;
    private readonly folderMetadata: FolderMetadata;

    constructor(
        folderPath: string,
        private readonly ffinder: FolderFinder
    ) {
        this.folderPath = folderPath;
    }

    public generateMetadata(filesList: string[]): boolean {
        return true;
    }

    public loadMetadata(): FolderMetadata {
        try {
            const folderMetadata: FolderMetadata = readJsonSync(`${this.folderPath}/${metadataFileName}`) as FolderMetadata;

            return folderMetadata;
        } catch (e) {
            if (e instanceof SyntaxError) {
                throw new InvalidMetadataException();
            }
            throw new MetadataNotFoundException();
        }
    }
}
