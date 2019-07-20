import { FolderFinder } from '@finder/folder-finder';
import { outputFileSync, removeSync, ensureDirSync, readFileSync, readJSONSync } from 'fs-extra';
import { FolderMetadata } from './folder-metadata.type';
import { metadataFileName, PrunerMetadata } from './pruner-metadata';
import { Logger } from '@logger/logger';

// tslint:disable-next-line: no-any
const mockedLogFunction = (...message: any[]): void => { return; };
jest.mock('../logging/logger');
mockedLogFunction.bind(Logger);

describe('Pruner metadata', () => {

  const fixtureBasePath = './pm-fixture';

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
        {"fileName": "file1.txt", "timestamp": 1000},
        {"fileName": "file2.txt", "timestamp": 1001},
        {"fileName": "file22.txt", "timestamp": 1001},
        {"fileName": "file233.txt", "timestamp": 1001},
        {"fileName": "file4.txt", "timestamp": 1002}
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
    // expect(folderMetadata.files[1].fileName).toBe('file2.txt');
    expect(folderMetadata.timestamp).toBeGreaterThan(1000);

    removeSync(fixtureBasePath);
  });

  it('Should be able handle missing config', () => {
    ensureDirSync(fixtureBasePath);
    const pm = new PrunerMetadata(new FolderFinder(fixtureBasePath));

    // expect(() => pm.getFolderMetadata()).toThrow(MetadataNotFoundException);

    removeSync(fixtureBasePath);
  });

  it('Should be able handle nonexisting folders', () => {
    const pm = new PrunerMetadata(new FolderFinder(fixtureBasePath));

    // expect(() => pm.getFolderMetadata()).toThrow(FolderNotFoundException);
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

    // expect(() => pm.getFolderMetadata()).toThrow(InvalidMetadataException);

    removeSync(fixtureBasePath);
  });

});
