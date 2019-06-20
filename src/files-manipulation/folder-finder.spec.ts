import { FolderFinder } from './folder-finder';
import { outputFileSync, removeSync } from 'fs-extra';
import { Logger } from '../logging/logger';

describe('Folder finder', () => {

  const fixtureBasePath = './fixture';

  beforeAll(() => {
    // Setup fixtures

    // Create a folder with random files
    outputFileSync(`${fixtureBasePath}/test.txt`, 'data');
    outputFileSync(`${fixtureBasePath}/test1.txt`, 'data');
    outputFileSync(`${fixtureBasePath}/test2.txt`, 'data');
    outputFileSync(`${fixtureBasePath}/inner/testK.txt`, 'data');
  });

  it('Should read a folder content', () => {
    const ff: FolderFinder = new FolderFinder(new Logger());
    const fileList: string[] = ff.openFolder(fixtureBasePath);
    const expectedResult = ['inner', 'test.txt', 'test1.txt', 'test2.txt'];

    expect(fileList).toEqual(expectedResult);
  });

  afterAll(() => {
    // Remove fixtures

    // Delete test folder
    removeSync(fixtureBasePath);
  });

});
