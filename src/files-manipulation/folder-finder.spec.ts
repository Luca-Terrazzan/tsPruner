import { FolderFinder } from './folder-finder';
import { outputFileSync, removeSync } from 'fs-extra';

describe('Folder finder', () => {

  const fixtureBasePath = './fixture';

  beforeAll(() => {
    // Setup fixtures

    // Create a folder with random files
    outputFileSync(`${fixtureBasePath}/test.txt`, 'data');
    outputFileSync(`${fixtureBasePath}/test1.txt`, 'data');
    outputFileSync(`${fixtureBasePath}/test2.txt`, 'data');
  });

  it('Should provide a folder contents', () => {
    const ff: FolderFinder = new FolderFinder();
    expect(ff.openFolder(`${fixtureBasePath}`)).toBeDefined();
  });

  afterAll(() => {
    // Remove fixtures

    // Delete test folder
    removeSync(fixtureBasePath);
  });

});
