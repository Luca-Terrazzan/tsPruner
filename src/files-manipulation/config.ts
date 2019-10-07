import { readJsonSync } from 'fs-extra';

type PrunerConfiguration = {
  age: number,
  path: string
};

const path = './';

export class Config {
  private readonly config: PrunerConfiguration;

  constructor() {
    this.config = readJsonSync(`${path}/pruner-config.json`) as PrunerConfiguration;
  }

  public getMaximumAge(): number {
    return this.config.age;
  }

  public getPathToPrune(): string {
    return this.config.path;
  }
}
