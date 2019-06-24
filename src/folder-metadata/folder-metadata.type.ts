export type FolderMetadata = {
  files: FileMetadata[]
  timestamp: number
};

type FileMetadata = {
  fileName: string,
  timestamp: number
};
