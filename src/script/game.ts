import Config from "./config";
import Data from "./data";
import Event from "./event";
import UI from "./ui";

export default class Game {
  get Config(): Config {
    return Config.getInstance();
  }

  get Data(): Data {
    return Data.getInstance(this);
  }

  get Event(): Event {
    return Event.getInstance(this);
  }

  get UI(): UI {
    return UI.getInstance(this);
  }

  run() {
    this.UI.syncTheme();
    this.UI.syncScore();
    !this.Config.record ? this.UI.newGame() : this.UI.syncRecord();
    this.Event.register();
  }
}
