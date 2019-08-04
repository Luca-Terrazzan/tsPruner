import { FolderMetadata } from 'folder-metadata/folder-metadata.type';
import { startPruning } from './pruner';

describe('Pruner', () => {
  it('Should be able to generate a folder metadata and get its file list', () => {
    const metadata: FolderMetadata = startPruning();
    console.log(metadata);

    expect(metadata).toBeDefined();
  });
});
