import { FolderFinder } from './files-manipulation/folder-finder';
import { PrunerMetadata } from './folder-metadata/pruner-metadata';
import { Logger } from './logging/logger';

function startPruning() {
  // Reading config
  const folderPath: string = './tempFolder';

  Logger.info('Starting application...');

  Logger.info('Attaching to folder');
  const ffinder: FolderFinder = new FolderFinder(folderPath);

  Logger.info('Loading metadata parser');
  const prunerMetadata: PrunerMetadata = new PrunerMetadata(ffinder);

  Logger.info('Parsing metadata...');
  prunerMetadata.generateFolderMetadata();
  Logger.info('...completed!');
}

startPruning();
