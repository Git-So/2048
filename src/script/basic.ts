import Config from "./config";
import Data from "./data";
import Event from "./event";
import Game from "./game";
import UI from "./ui";

export default class Basic {
  protected constructor(private game: Game) {}

  protected get Config(): Config {
    return this.game.Config;
  }

  protected get Data(): Data {
    return this.game.Data;
  }

  protected get Event(): Event {
    return this.game.Event;
  }

  protected get UI(): UI {
    return this.game.UI;
  }
}
