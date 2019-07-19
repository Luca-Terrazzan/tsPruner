import { Logger } from './logger';

global.console.log = jest.fn();

describe('Logger', () => {

  it('Should provide logging methods', () => {
    Logger.error('error test message');

    expect(Logger.info).toBeDefined();
    expect(Logger.debug).toBeDefined();
    expect(Logger.warning).toBeDefined();
    expect(Logger.error).toBeDefined();
  });

});
