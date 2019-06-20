import { LogLevels } from './log-levels.enum';

export class Logger {

  public info(message: string) {
    this.log(message, LogLevels.INFO);
  }

  public debug(message: string) {
    this.log(message, LogLevels.DEBUG);
  }

  public warning(message: string) {
    this.log(message, LogLevels.WARNING);
  }

  public error(message: string) {
    this.log(message, LogLevels.ERROR);
  }

  private log(message: string, logLevel: LogLevels) {
    console.log(message);
  }

}
