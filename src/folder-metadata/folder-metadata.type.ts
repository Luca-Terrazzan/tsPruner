export type FolderMetadata = {
  files: Map<string, FileMetadata>
  timestamp: number
};

export type FileMetadata = {
  fileName: string,
  timestamp: number
};
