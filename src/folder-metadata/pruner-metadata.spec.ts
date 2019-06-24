import { outputFileSync, removeSync } from 'fs-extra';
import { PrunerMetadata, metadataFileName } from './pruner-metadata';
import { FolderFinder } from '../files-manipulation/folder-finder';
import { Logger } from '../logging/logger';
import { FolderMetadata } from './folder-metadata.type';

describe('Pruner metadata', () => {

    const fixtureBasePath = './pm-fixture';

    beforeAll(() => {
        // Setup fixtures

        // Create a folder with random files
        outputFileSync(`${fixtureBasePath}/${metadataFileName}`, '{"filses": [1,2,3]}');
    });

    it('Should be able to read pruner metadata', () => {
        const logger = Logger.getInstance();
        const pm = new PrunerMetadata(`${fixtureBasePath}`, new FolderFinder(logger), logger);
        const metadata = pm.getFolderMetadata();

        const expectedFolderMetadata: FolderMetadata = {
            files
        };

        expect(metadata).toBeDefined();
    });

    afterAll(() => {
        // Remove fixtures

        // Delete test folder
        removeSync(fixtureBasePath);
    });

});
