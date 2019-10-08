import { ensureDirSync, outputFileSync, readJSONSync, removeSync } from 'fs-extra';

import { FolderFinder } from '../files-manipulation/folder-finder';
import { Logger } from '../logging/logger';
import { InvalidMetadataException } from './exceptions';
import { FileMetadata, FolderMetadata } from './folder-metadata.type';
import { metadataFileName, PrunerMetadata } from './pruner-metadata';

// tslint:disable-next-line: no-any
const mockedLogFunction = (...message: any[]): void => { return; };
jest.mock('../logging/logger');
mockedLogFunction.bind(Logger);

describe('Pruner metadata', () => {

  const fixtureBasePath = './pm-fixture';

  beforeEach(() => { removeSync(fixtureBasePath); });

  it('Should be able to generate a folder metadata from scratch', () => {
    // Write some random files
    ensureDirSync(fixtureBasePath);
    outputFileSync(`${fixtureBasePath}/file1.txt`, { content: 1 });
    outputFileSync(`${fixtureBasePath}/file2.txt`, { content: 2 });
    outputFileSync(`${fixtureBasePath}/file3.txt`, { content: 3 });

    const pm = new PrunerMetadata(new FolderFinder(fixtureBasePath));
    pm.generateFolderMetadata();

    const folderMetadata: FolderMetadata =
      readJSONSync(`${fixtureBasePath}/${metadataFileName}`) as FolderMetadata;

    expect(folderMetadata).toBeDefined();
    expect(folderMetadata.files).toHaveLength(3);
    expect(folderMetadata.timestamp).toBeGreaterThan(1000);

    removeSync(fixtureBasePath);
  });

  it('Should be able to overwrite folder metadata ', () => {
    // Create a valid metadata file for older files
    outputFileSync(
      `${fixtureBasePath}/${metadataFileName}`,
      `{"files": [
        ["file1.txt", {"fileName": "file1.txt", "timestamp": 1000}],
        ["file2.txt", {"fileName": "file2.txt", "timestamp": 10020}],
        ["file3.txt", {"fileName": "file3.txt", "timestamp": 10030}],
        ["file4.txt", {"fileName": "file4.txt", "timestamp": 10010}]
        ], "timestamp": 999}`
    );

    // Write some random files, two of these was already metadata'ed
    ensureDirSync(fixtureBasePath);
    outputFileSync(`${fixtureBasePath}/file1.txt`, { content: 1 });
    outputFileSync(`${fixtureBasePath}/file2.txt`, { content: 2 });
    outputFileSync(`${fixtureBasePath}/file3.txt`, { content: 3 });

    const pm = new PrunerMetadata(new FolderFinder(fixtureBasePath));
    pm.generateFolderMetadata();

    const folderMetadata: FolderMetadata =
      readJSONSync(`${fixtureBasePath}/${metadataFileName}`) as FolderMetadata;

    expect(folderMetadata).toBeDefined();
    expect(folderMetadata.files).toHaveLength(3);
    expect((folderMetadata.files as unknown as Array<[string, FileMetadata]>)[1][1].fileName)
      .toBe(`${fixtureBasePath}/file2.txt`);
    expect(folderMetadata.timestamp).toBeGreaterThan(1000);

    removeSync(fixtureBasePath);
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

    expect(() => pm.generateFolderMetadata()).toThrow(InvalidMetadataException);

    removeSync(fixtureBasePath);
  });

});
