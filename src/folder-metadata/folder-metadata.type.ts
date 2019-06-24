export type FolderMetadata = {
  files: FileMetadata[]
  timestamp: number
};

export type FileMetadata = {
  fileName: string,
  timestamp: number
};
