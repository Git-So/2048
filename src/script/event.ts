import Basic from "./basic";
import Game from "./game";
import UI from "./ui";
import { DIRECTION } from "./type";

export default class Event extends Basic {
  private static _instance: Event;
  static getInstance(game: Game): Event {
    if (!this._instance) this._instance = new Event(game);
    return this._instance;
  }

  // 注册事件
  register() {
    // 按键事件
    document.onkeyup = (e) => {
      switch (e.key) {
        case "i":
        case "I":
        case "w":
        case "W":
        case "ArrowUp":
          this.UI.play(DIRECTION.UP);
          break;
        case "k":
        case "K":
        case "s":
        case "S":
        case "ArrowDown":
          this.UI.play(DIRECTION.DOWN);
          break;
        case "j":
        case "J":
        case "a":
        case "A":
        case "ArrowLeft":
          this.UI.play(DIRECTION.LEFT);
          break;
        case "l":
        case "L":
        case "d":
        case "D":
        case "ArrowRight":
          this.UI.play(DIRECTION.RIGHT);
          break;
      }
    };

    // 主题
    this.UI.themeBtnEl.addEventListener("click", () => {
      this.Config.theme = this.Config.theme == "light" ? "dark" : "light";
      this.UI.syncTheme();
    });

    // 重置
    this.UI.restartBtnEl.addEventListener("click", () => this.UI.newGame());
  }
}
