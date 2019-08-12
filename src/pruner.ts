import { FolderFinder } from './files-manipulation/folder-finder';
import { PrunerMetadata } from './folder-metadata/pruner-metadata';
import { Logger } from './logging/logger';
import { Config } from './files-manipulation/config';

export function startPruning() {
  // Reading config
  const configuration = new Config();
  const folderPath: string = configuration.getPathToPrune();
  Logger.debug('Configuration:', configuration);

  Logger.info('Starting application...');

  Logger.info('Attaching to folder');
  const ffinder: FolderFinder = new FolderFinder(folderPath);

  Logger.info('Loading metadata parser');
  const prunerMetadata: PrunerMetadata = new PrunerMetadata(ffinder);

  Logger.info('Parsing metadata...');
  const folderMetdata = prunerMetadata.getMetadata();
  Logger.debug('Folder metadata:', folderMetdata);
  Logger.info('...completed!');

  return folderMetdata;
}

// startPruning();
