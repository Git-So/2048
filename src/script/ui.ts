import Game from "./game";
import Basic from "./basic";
import Data from "./data";

const $ = (tag: string) => document.querySelector(tag);
const $$ = (tag: string) => document.querySelectorAll(tag);

export default class UI extends Basic {
  private static _instance: UI;
  static getInstance(game: Game): UI {
    if (!this._instance) this._instance = new UI(game);
    return this._instance;
  }

  // 方向
  static readonly UP = 1;
  static readonly DOWN = 2;
  static readonly LEFT = 3;
  static readonly RIGHT = 4;

  // 数字格
  cellElArr = (): NodeListOf<Element> => {
    return $$("g-layer[is-content=true] g-cell");
  };

  htmlEl = $("html");

  themeBtnEl = $("#game-theme");
  restartBtnEl = $("#game-restart");

  scoreEl = $("#score"); // 分数
  topScoreEl = $("#top-score"); // 最高分数
  contentLayerEl = $("g-layer[is-content=true]"); // 数字内容层
  cellTemplateNode = $("g-template g-cell"); // 数字格模板

  // 合并格子数字
  mergeCellNumber(el: Element, num: number) {
    let child = el.firstElementChild.cloneNode(true) as Element;
    child.setAttribute("is-merge", "true");
    child.setAttribute("content", num.toString());

    el.innerHTML = "";
    el.appendChild(child);
  }

  // 重置数据
  restart() {
    this.UI.cleanScore();
    this.UI.cleanCell();
    this.UI.randomCell();
    this.UI.randomCell();
  }

  // 切换主题
  changeTheme() {
    let theme = this.htmlEl.getAttribute("theme");
    this.htmlEl.setAttribute("theme", theme == "light" ? "dark" : "light");
  }

  // 清理分数
  cleanScore() {
    // 保存最高分
    if (Number(this.topScoreEl.innerHTML) < Number(this.scoreEl.innerHTML))
      this.topScoreEl.innerHTML = this.scoreEl.innerHTML;
    this.updateScore(0);
  }

  // 更新分数
  updateScore(num: number) {
    this.scoreEl.innerHTML = num.toString();
  }

  // 增加分数
  incScore(incNum: number) {
    let num = Number(this.scoreEl.innerHTML);
    this.updateScore(incNum + num);
  }

  // 清理数字格
  cleanCell() {
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
  play(direction: number) {
    let html = this.contentLayerEl.innerHTML;

    // 处理数据格移动合并
    let objArr = this.Data.getNumberCellRecord();
    for (let i = 0; i < Data.COL; i++) {
      for (let j = 0; j < Data.ROW; j++) {
        for (let k = j + 1; k < Data.ROW; k++) {
          let [x, y, x2, y2] = [i, j, i, k];
          // 获取参照物
          switch (direction) {
            case UI.DOWN:
              [x, y, x2, y2] = [i, Data.ROW - 1 - j, i, Data.ROW - 1 - k];
              break;
            case UI.LEFT:
              [x, y, x2, y2] = [j, i, k, i];
              break;
            case UI.RIGHT:
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
              direction == UI.LEFT || direction == UI.RIGHT ? "x" : "y",
              (direction == UI.LEFT || direction == UI.RIGHT ? x : y).toString()
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

    // 游戏未结束
    if (html == this.contentLayerEl.innerHTML) return;
    if (!this.Data.isOver()) this.randomCell();
  }
}
