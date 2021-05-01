import Game from "./game";
import Basic from "./basic";
import Data from "./data";
import { DIRECTION, MSG_LEVEL } from "./type";
import DEFAULT from "./default";

const $ = (tag: string) => document.querySelector(tag);
const $$ = (tag: string) => document.querySelectorAll(tag);

export default class UI extends Basic {
  private static _instance: UI;
  static getInstance(game: Game): UI {
    if (!this._instance) this._instance = new UI(game);
    return this._instance;
  }

  // 主题
  static readonly THEME_LIGHT = "light";
  static readonly THEME_DARK = "dark";

  // 防止连击太快
  isLock = false;

  // 方向
  static readonly UP = 1;
  static readonly DOWN = 2;
  static readonly LEFT = 3;
  static readonly RIGHT = 4;

  // 状态提示等级
  static readonly MSG_INFO = "info";
  static readonly MSG_SUCCESS = "success";
  static readonly MSG_ERROR = "error";

  // 数字格
  cellElArr = (): NodeListOf<Element> => {
    return $$("g-layer[is-content=true] g-cell");
  };

  htmlEl = $("html");

  themeBtnEl = $("#game-theme");
  themeBtnIconEl = $("#game-theme g-icon");
  restartBtnEl = $("#game-restart");

  scoreEl = $("#score"); // 分数
  topScoreEl = $("#top-score"); // 最高分数
  contentLayerEl = $("g-layer[is-content=true]"); // 数字内容层
  cellTemplateNode = $("g-template g-cell"); // 数字格模板

  alertEl = $("g-alert"); // 提示框
  alertMsgEl = $("g-alert span"); // 提示内容

  // 合并格子数字
  mergeCellNumber(el: Element, num: number) {
    let child = el.firstElementChild.cloneNode(true) as Element;
    child.setAttribute("is-merge", "true");
    child.setAttribute("content", num.toString());

    el.innerHTML = "";
    el.appendChild(child);
  }

  // 重置数据
  newGame() {
    this.UI.cleanScore();
    this.UI.cleanCell();
    this.sendMessage(DEFAULT.MSG_TEXT, DEFAULT.MSG_LEVEL);

    this.UI.randomCell();
    this.UI.randomCell();
  }

  // 消息通知
  sendMessage(msg: string, level = UI.MSG_INFO) {
    this.Config.msgText = msg;
    this.Config.msgLevel = level;
    this.alertEl.setAttribute("level", level);
    this.alertMsgEl.innerHTML = msg;
  }

  // 同步消息通知
  syncMessage() {
    this.sendMessage(this.Config.msgText, this.Config.msgLevel);
  }

  // 同步主题
  syncTheme() {
    this.themeBtnIconEl.setAttribute("name", this.Config.theme);
    this.htmlEl.setAttribute("theme", this.Config.theme);
  }

  // 同步存档
  syncRecord() {
    if (!this.Config.record) return;

    // 添加数字格
    this.contentLayerEl.innerHTML = "";
    let recordArr = this.Config.record.split("");
    for (let [idx, cell] of recordArr.entries()) {
      if (cell == "0") continue;

      // 设置数字格信息
      let cellNode = this.cellTemplateNode.cloneNode(true) as Element;
      cellNode.setAttribute("y", Math.floor(idx / 4).toString());
      cellNode.setAttribute("x", (idx % 4).toString());
      cellNode.firstElementChild.setAttribute(
        "content",
        Data.recordMapByNum.get(cell)
      );
      this.contentLayerEl.appendChild(cellNode);
    }
  }

  // 清理分数
  cleanScore() {
    this.updateScore(0);
  }

  // 同步分数
  syncScore() {
    this.scoreEl.innerHTML = this.Config.score.toString();
    this.topScoreEl.innerHTML = this.Config.topScore.toString();
  }

  // 更新分数
  updateScore(num: number) {
    this.Config.score = num;
    this.scoreEl.innerHTML = num.toString();

    // 更新最高分
    if (this.Config.topScore < this.Config.score)
      this.Config.topScore = this.Config.score;

    this.syncScore();
  }

  // 增加分数
  incScore(incNum: number) {
    let num = Number(this.scoreEl.innerHTML);
    this.updateScore(incNum + num);
  }

  // 清理数字格
  cleanCell() {
    this.Config.record = "";
    this.contentLayerEl.innerHTML = "";
  }

  // 随机一个棋子
  randomCell() {
    let cell = this.Data.getRandomCell();
    if (!cell) return;

    // 设置数字格信息
    let cellNode = this.cellTemplateNode.cloneNode(true) as Element;
    cellNode.setAttribute("x", cell.x.toString());
    cellNode.setAttribute("y", cell.y.toString());
    cellNode.firstElementChild.setAttribute("content", cell.content.toString());
    this.contentLayerEl.appendChild(cellNode);
  }

  // 玩游戏
  play(direction: DIRECTION) {
    if (this.isLock) return;
    this.isLock = true;

    // 处理数据格移动合并
    let objArr = this.Data.getNumberCellRecord();
    for (let i = 0; i < Data.COL; i++) {
      for (let j = 0; j < Data.ROW; j++) {
        for (let k = j + 1; k < Data.ROW; k++) {
          let [x, y, x2, y2] = [i, j, i, k];
          // 获取参照物
          switch (direction) {
            case DIRECTION.DOWN:
              [x, y, x2, y2] = [i, Data.ROW - 1 - j, i, Data.ROW - 1 - k];
              break;
            case DIRECTION.LEFT:
              [x, y, x2, y2] = [j, i, k, i];
              break;
            case DIRECTION.RIGHT:
              [x, y, x2, y2] = [Data.COL - 1 - j, i, Data.COL - 1 - k, i];
              break;
          }

          // 对比数据为空
          if (!objArr[y2][x2]) continue;

          // 对比数据与当前数据互换
          if (!objArr[y][x]) {
            objArr[y][x] = objArr[y2][x2];
            objArr[y2][x2] = undefined;

            objArr[y][x].el.setAttribute(
              // name
              direction == DIRECTION.LEFT || direction == DIRECTION.RIGHT
                ? "x"
                : "y",
              // value
              (direction == DIRECTION.LEFT || direction == DIRECTION.RIGHT
                ? x
                : y
              ).toString()
            );
            continue;
          }

          // 当前数据和对比数据一致
          if (objArr[y][x].content == objArr[y2][x2].content) {
            // 清除重复数据
            objArr[y2][x2].el.parentNode.removeChild(objArr[y2][x2].el);
            objArr[y2][x2] = undefined;

            // 添加分数
            this.incScore(objArr[y][x].content);

            // 修改合并数字格
            objArr[y][x].content = objArr[y][x].content * 2;
            this.mergeCellNumber(objArr[y][x].el, objArr[y][x].content);
          }
          break;
        }
      }
    }

    // 开始游戏则保存记录
    this.Config.record = this.Data.getRecordString();

    // 生成随机数字
    this.randomCell();

    // 状态解锁
    this.isLock = false;

    // 游戏结束
    if (this.Data.isOver()) {
      let isSuccess = this.Config.record.indexOf("B") > -1;

      let level = isSuccess ? MSG_LEVEL.SUCCESS : MSG_LEVEL.ERROR; // 合成 2048 则胜利
      let message = isSuccess
        ? "恭喜合成2048获得游戏胜利！"
        : "很遗憾！未合成2048";

      this.sendMessage(message, level);
    }
  }
}
