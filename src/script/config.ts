export default class Config {
  private static _instance: Config;
  static getInstance(): Config {
    if (!this._instance) this._instance = new Config();
    return this._instance;
  }
}
