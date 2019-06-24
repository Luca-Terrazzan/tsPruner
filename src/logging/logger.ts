import { LogLevels } from './log-levels.enum';

// tslint:disable: no-any
export class Logger {

  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public info(...message: any[]) {
    this.log(LogLevels.INFO, message);
  }

  public debug(...message: any[]) {
    this.log(LogLevels.DEBUG, message);
  }

  public warning(...message: any[]) {
    this.log(LogLevels.WARNING, message);
  }

  public error(...message: any[]) {
    this.log(LogLevels.ERROR, message);
  }

  /**
   * TODO: implement different logging methods to console/file
   *
   * @private
   * @param {LogLevels} logLevel
   * @param {...any[]} message
   * @memberof Logger
   */
  private log(logLevel: LogLevels, ...message: any[]) {
    console.log(logLevel, message);
  }

}
