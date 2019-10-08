import { FileMetadata, FolderMetadata } from 'folder-metadata/folder-metadata.type';

import { Dater } from './dater';

describe('Dater', () => {
  it('Should be able to mark an old file for deletion', () => {
    const folderMetadata: FolderMetadata = {
      files: new Map<string, FileMetadata>(
        [
          ['file1', { fileName: 'asd/filename1', timestamp: 1560557702349 }], // 6/15/2019, 2:15:02 AM
          ['file2', { fileName: 'asd/filename2', timestamp: 1540559702349 }] // 10/26/2018, 3:15:02 PM
        ]
      ),
      timestamp: 1570567792349 // 10/8/2019, 10:49:52 PM
    };
    const dater = new Dater(folderMetadata);
    dater.deleteFilesOlderThan(200);

    expect(folderMetadata.files.get('file2').fileName).toBe('deleted');
    expect(folderMetadata.files.get('file1').fileName).toBe('asd/filename1');
  });
});
