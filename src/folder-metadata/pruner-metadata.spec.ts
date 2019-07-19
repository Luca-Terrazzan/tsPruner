import { FolderFinder } from '@finder/folder-finder';
import { outputFileSync, removeSync, ensureDirSync } from 'fs-extra';
import { InvalidMetadataException, MetadataNotFoundException } from './exceptions';
import { FolderMetadata } from './folder-metadata.type';
import { metadataFileName, PrunerMetadata } from './pruner-metadata';
import { FolderNotFoundException } from '@finder/exceptions';
import { Logger } from '@logger/logger';

// tslint:disable-next-line: no-any
const mockedLogFunction = (...message: any[]): void => { return; };
jest.mock('../logging/logger');
mockedLogFunction.bind(Logger);

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

    const pm = new PrunerMetadata(new FolderFinder(fixtureBasePath));
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
    ensureDirSync(fixtureBasePath);
    const pm = new PrunerMetadata(new FolderFinder(fixtureBasePath));

    expect(() => pm.getFolderMetadata()).toThrow(MetadataNotFoundException);

    removeSync(fixtureBasePath);
  });

  it('Should be able handle nonexisting folders', () => {
    const pm = new PrunerMetadata(new FolderFinder(fixtureBasePath));

    expect(() => pm.getFolderMetadata()).toThrow(FolderNotFoundException);
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
    const pm = new PrunerMetadata(new FolderFinder(fixtureBasePath));

    expect(() => pm.getFolderMetadata()).toThrow(InvalidMetadataException);

    removeSync(fixtureBasePath);
  });

});
