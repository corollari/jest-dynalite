import fs from "fs";
import { resolve } from "path";
import { CreateTableInput } from "aws-sdk/clients/dynamodb";

interface Config {
  tables?: CreateTableInput[];
  basePort?: number;
}

const loadConfig = async (configFile: string): Promise<Config> =>
  fs.existsSync(configFile) ? import(configFile) : {};

const configFile = (configDir: string): string =>
  resolve(configDir, "jest-dynalite-config.js");

let config = loadConfig(configFile(process.cwd()));

export const setConfigDir = (configDir: string): void => {
  config = loadConfig(configFile(configDir));
};

export const getDynalitePort = async (): Promise<number> =>
  ((await config).basePort || 8000) +
  parseInt(process.env.JEST_WORKER_ID as string, 10);

export const getTables = async (): Promise<CreateTableInput[]> =>
  (await config).tables || [];
