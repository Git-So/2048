import DEFAULT from "./default";
export default class Config {
  private static _instance: Config;
  static getInstance(): Config {
    if (!this._instance) this._instance = new Config();
    return this._instance;
  }
  private constructor() {
    this.init();
  }

  private db = localStorage;

  // 主题
  readonly KEY_THEME = "theme";
  set theme(value: string) {
    this.db.setItem(this.KEY_THEME, JSON.stringify(value));
  }
  get theme(): string {
    return JSON.parse(this.db.getItem(this.KEY_THEME));
  }

  // 数据格状态
  readonly KEY_RECORD = "record";
  set record(value: string) {
    this.db.setItem(this.KEY_RECORD, JSON.stringify(value));
  }
  get record(): string {
    return JSON.parse(this.db.getItem(this.KEY_RECORD));
  }

  // 目前分数
  readonly KEY_SCORE = "score";
  set score(value: number) {
    this.db.setItem(this.KEY_SCORE, JSON.stringify(value));
  }
  get score(): number {
    return JSON.parse(this.db.getItem(this.KEY_SCORE));
  }

  // 最高分
  readonly KEY_TOP_SCORE = "top_score";
  set topScore(value: number) {
    this.db.setItem(this.KEY_TOP_SCORE, JSON.stringify(value));
  }
  get topScore(): number {
    return JSON.parse(this.db.getItem(this.KEY_TOP_SCORE));
  }

  // 提示信息
  readonly KEY_MSG_TEXT = "msg_text";
  set msgText(value: string) {
    this.db.setItem(this.KEY_MSG_TEXT, JSON.stringify(value));
  }
  get msgText(): string {
    return JSON.parse(this.db.getItem(this.KEY_MSG_TEXT));
  }

  // 提示信息等级
  readonly KEY_MSG_LEVEL = "msg_level";
  set msgLevel(value: string) {
    this.db.setItem(this.KEY_MSG_LEVEL, JSON.stringify(value));
  }
  get msgLevel(): string {
    return JSON.parse(this.db.getItem(this.KEY_MSG_LEVEL));
  }

  // 储存器是否存在数据
  has(key: string): boolean {
    return this.db.hasOwnProperty(key);
  }

  // 初始化数据
  init() {
    this.has(this.KEY_THEME) || (this.theme = DEFAULT.THEME);
    this.has(this.KEY_RECORD) || (this.record = DEFAULT.RECORD);
    this.has(this.KEY_SCORE) || (this.score = 0);
    this.has(this.KEY_TOP_SCORE) || (this.topScore = 0);
    this.has(this.KEY_MSG_TEXT) || (this.msgText = DEFAULT.MSG_TEXT);
    this.has(this.KEY_MSG_LEVEL) || (this.msgLevel = DEFAULT.MSG_LEVEL);
  }
}
