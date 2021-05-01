import Game from "./game";
import Basic from "./basic";

interface CellElement {
  el: Element;
  content: number;
}

interface Cell {
  x: number;
  y: number;
  content: number;
}

export default class Data extends Basic {
  private static _instance: Data;
  static getInstance(game: Game): Data {
    if (!this._instance) this._instance = new Data(game);
    return this._instance;
  }

  static readonly ROW = 4;
  static readonly COL = 4;

  static readonly NUMBER_ARR = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
  static readonly RANDOM_LENGTH = 2; // 随机数字相对全部数字长度

  // 数字格记录处理辅助数据
  static readonly recordMap: [string, string][] = [
    ["2", "1"],
    ["4", "2"],
    ["8", "3"],
    ["16", "4"],
    ["32", "5"],
    ["64", "6"],
    ["128", "7"],
    ["256", "8"],
    ["512", "9"],
    ["1024", "A"],
    ["2048", "B"],
  ];
  static readonly recordMapByIdx = new Map(Data.recordMap);
  static readonly recordMapByNum = (function () {
    let recordMapReverse = Data.recordMap.map((val) => {
      return val.reverse();
    });
    return new Map(recordMapReverse as [string, string][]);
  })();

  // 获取当前数字格数据
  getNumberCellRecord(): CellElement[][] {
    let cellArr: CellElement[][] = JSON.parse(
      JSON.stringify(
        new Array(Data.COL).fill(new Array(Data.ROW).fill(undefined))
      )
    );

    this.UI.cellElArr().forEach((el) => {
      let x = el.getAttribute("x") as unknown;
      let y = el.getAttribute("y") as unknown;
      let content = el.firstElementChild.getAttribute("content") as unknown;
      cellArr[Number(y)][Number(x)] = {
        el: el,
        content: Number(content),
      };
    });
    return cellArr;
  }

  // 获取数字格数据字符状态
  getRecordString(): string {
    let str = "";
    let cellArr = this.getNumberCellRecord();
    for (let y = 0; y < Data.COL; y++) {
      for (let x = 0; x < Data.ROW; x++) {
        if (!cellArr[y][x]) {
          str += "0";
          continue;
        }

        str += !cellArr[y][x]
          ? "0"
          : Data.recordMapByIdx.get(cellArr[y][x].content.toString());
      }
    }

    return str;
  }

  // 游戏是否结束
  isOver(): boolean {
    // 是否满格
    let cellElArr = this.UI.cellElArr();
    if (!cellElArr || cellElArr.length < Data.ROW * Data.COL) return false;

    // 是否还可以合并
    let cellArr = this.getNumberCellRecord();
    for (let y = 0; y < Data.COL - 1; y++) {
      for (let x = 0; x < Data.ROW - 1; x++) {
        if (
          cellArr[y][x].content == cellArr[y + 1][x].content ||
          cellArr[y][x].content == cellArr[y][x + 1].content
        )
          return false;
      }
    }
    return true;
  }

  // 获取随机空格
  getRandomCell(): Cell {
    if (this.isOver()) return undefined;

    // 保底数量
    let nullNum = Data.ROW * Data.COL - this.UI.cellElArr().length;

    let cellArr = this.getNumberCellRecord();
    for (let y = 0; y < Data.COL; y++) {
      for (let x = 0; x < Data.ROW; x++) {
        if (cellArr[y][x]) continue;

        // 保底或到达生成位置
        if (nullNum == 1 || Math.floor(Math.random() * nullNum) == 0) {
          return {
            x: x,
            y: y,
            content:
              Data.NUMBER_ARR[Math.floor(Math.random() * Data.RANDOM_LENGTH)],
          };
        }
        nullNum--;
      }
    }
    return undefined;
  }
}
