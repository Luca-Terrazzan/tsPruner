import { LogLevels } from './log-levels.enum';

// tslint:disable: no-any
export class Logger {

  public static info(...message: any[]) {
    Logger.log(LogLevels.INFO, message);
  }

  public static debug(...message: any[]) {
    Logger.log(LogLevels.DEBUG, message);
  }

  public static warning(...message: any[]) {
    Logger.log(LogLevels.WARNING, message);
  }

  public static error(...message: any[]) {
    Logger.log(LogLevels.ERROR, message);
  }

  /**
   * TODO: implement different logging methods to console/file
   *
   * @private
   * @param {LogLevels} logLevel
   * @param {...any[]} message
   * @memberof Logger
   */
  private static log(logLevel: LogLevels, ...message: any[]) {
    console.log(logLevel, message);
  }

}
