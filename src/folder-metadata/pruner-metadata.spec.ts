import { FolderFinder } from '@finder/folder-finder';
import { Logger } from '@logger/logger';
import { outputFileSync, removeSync } from 'fs-extra';
import { InvalidMetadataException, MetadataNotFoundException } from './exceptions';
import { FolderMetadata } from './folder-metadata.type';
import { metadataFileName, PrunerMetadata } from './pruner-metadata';

describe('Pruner metadata', () => {

  const fixtureBasePath = './pm-fixture';
  const mock = jest.fn();
  const logger = new mock() as Logger;
  logger.error = () => {
    // do nothing
  };

  it('Should be able to read pruner metadata', () => {
    // Create a valid metadata file
    outputFileSync(
      `${fixtureBasePath}/${metadataFileName}`,
      `{"files": [
        {"fileName": "file1.txt", "timestamp": 1000},
        {"fileName": "file2.txt", "timestamp": 1001}
        ], "timestamp": 999}`
    );

    const pm = new PrunerMetadata(`${fixtureBasePath}`, new FolderFinder(logger), logger);
    const metadata = pm.getFolderMetadata();

    const expectedFolderMetadata: FolderMetadata = {
      files: [
        { fileName: 'file1.txt', timestamp: 1000 },
        { fileName: 'file2.txt', timestamp: 1001 }
      ],
      timestamp: 999
    };

    expect(metadata).toEqual(expectedFolderMetadata);

    removeSync(fixtureBasePath);
  });

  it('Should be able handle missing config', () => {
    const pm = new PrunerMetadata(`${fixtureBasePath}`, new FolderFinder(logger), logger);

    expect(() => pm.getFolderMetadata()).toThrow(MetadataNotFoundException);
  });

  it('Should be able handle malformed config', () => {
    // Create an invalid metadata file
    outputFileSync(
      `${fixtureBasePath}/${metadataFileName}`,
      `{"filesa": [
        {"fileName": "file1.txt", "timestamp1": 1000},
        {"fileName2": "file2.txt", "timestampss": 1001}
        ], "timestaamp": 999}`
    );
    const pm = new PrunerMetadata(`${fixtureBasePath}`, new FolderFinder(logger), logger);

    expect(() => pm.getFolderMetadata()).toThrow(InvalidMetadataException);

    removeSync(fixtureBasePath);
  });

});
