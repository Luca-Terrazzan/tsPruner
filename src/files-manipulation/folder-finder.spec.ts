import { Logger } from '@logger/logger';
import { outputFileSync, removeSync } from 'fs-extra';
import { FolderFinder } from './folder-finder';

describe('Folder finder', () => {

  const fixtureBasePath = './ff-fixture';
  const mock = jest.fn();
  const logger = new mock() as Logger;

  beforeAll(() => {
    // Setup fixtures

    // Create a folder with random files
    outputFileSync(`${fixtureBasePath}/test.txt`, 'data');
    outputFileSync(`${fixtureBasePath}/test1.txt`, 'data');
    outputFileSync(`${fixtureBasePath}/test2.txt`, 'data');
    outputFileSync(`${fixtureBasePath}/inner/testK.txt`, 'data');
  });

  it('Should be able to read a folder content', () => {
    const ff: FolderFinder = new FolderFinder(logger);
    const fileList: string[] = ff.openFolder(fixtureBasePath);
    const expectedResult = ['inner', 'test.txt', 'test1.txt', 'test2.txt'];

    expect(fileList).toEqual(expectedResult);
  });

  it('Should be able to read a folder content while skipping subfolders', () => {
    const ff: FolderFinder = new FolderFinder(logger);
    const fileList: string[] = ff.openFolder(fixtureBasePath, true);
    const expectedResult = ['test.txt', 'test1.txt', 'test2.txt'];

    expect(fileList).toEqual(expectedResult);
  });

  afterAll(() => {
    // Remove fixtures

    // Delete test folder
    removeSync(fixtureBasePath);
  });

});
