import { outputFileSync, removeSync } from 'fs-extra';
import { PrunerMetadata, metadataFileName } from './pruner-metadata';
import { FolderFinder } from '../files-manipulation/folder-finder';
import { Logger } from '../logging/logger';
import { FolderMetadata } from './folder-metadata.type';

describe('Pruner metadata', () => {

  const fixtureBasePath = './pm-fixture';

  it('Should be able to read pruner metadata', () => {
    // Create a valid metadata file
    outputFileSync(
      `${fixtureBasePath}/${metadataFileName}`,
      `{"files": [
        {"fileName": "file1.txt", "timestamp": 1000},
        {"fileName": "file2.txt", "timestamp": 1001}
        ], "timestamp": 999}`
    );

    const logger = Logger.getInstance();
    const pm = new PrunerMetadata(`${fixtureBasePath}`, new FolderFinder(logger), logger);
    const metadata = pm.getFolderMetadata();

    const expectedFolderMetadata: FolderMetadata = {
      files: [
        {fileName: 'file1.txt', timestamp: 1000},
        {fileName: 'file2.txt', timestamp: 1001}
      ],
      timestamp: 999
    };

    expect(metadata).toEqual(expectedFolderMetadata);
  });

  afterAll(() => {
    // Remove fixtures

    // Delete test folder
    removeSync(fixtureBasePath);
  });

});
