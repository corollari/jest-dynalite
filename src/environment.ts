import NodeEnvironment from "jest-environment-node";
import { Config } from "@jest/types";
import setup from "./setup";
import { start, stop } from "./db";

export default class DynaliteEnvironment extends NodeEnvironment {
  promisedSetup: ReturnType<typeof setup>;

  constructor(projectConfig: Config.ProjectConfig) {
    setup(projectConfig.rootDir);
    super(projectConfig);
    // The config directory is based on the root directory
    // of the project config
    this.promisedSetup = setup(projectConfig.rootDir);
  }

  public async setup(): Promise<void> {
    await this.promisedSetup;
    await super.setup();
    await start();
  }

  async teardown(): Promise<void> {
    await this.promisedSetup;
    await stop();
    await super.teardown();
  }
}
