import { Action } from "vis-three";

// 物体拾取动作
export class SelectionAction extends Action {
  static touch = false;
  static cacheSymbolBox = [];

  constructor({ engine, objectSymbols, store }) {
    super();
    this.engine = engine;
    this.oldSymbolBox = [].concat(SelectionAction.cacheSymbolBox);
    this.$store = store;

    this.newSymbolBox = [].concat(objectSymbols);

    SelectionAction.cacheSelectionBox = [].concat(objectSymbols);
  }

  next() {
    SelectionAction.touch = true;
    const compilerManager = this.engine.compilerManager;
    const objects = [];
    this.newSymbolBox.forEach((symbol) => {
      const object = compilerManager.getObjectBySymbol(symbol);
      if (object) {
        objects.push(object);
      } else {
        console.warn(`selection action can not font object: ${symbol}`);
      }
    });
    this.engine.setSelectionBox({ objects });

    if (this.newSymbolBox.length === 1) {
      this.$store.commit(
        "active/object",
        this.engine.getConfigBySymbol(this.newSymbolBox[0])
      );
    } else {
      this.$store.commit("active/clear");
    }
  }

  prev() {
    SelectionAction.touch = true;
    const compilerManager = this.engine.compilerManager;
    const objects = [];
    this.oldSymbolBox.forEach((symbol) => {
      const object = compilerManager.getObjectBySymbol(symbol);
      if (object) {
        objects.push(object);
      } else {
        console.warn(`selection action can not font object: ${symbol}`);
      }
    });
    this.engine.setSelectionBox({ objects });

    if (this.oldSymbolBox.length === 1) {
      this.$store.commit(
        "active/object",
        this.engine.compilerManager.getObjectConfig(this.oldSymbolBox[0])
      );
    } else {
      this.$store.commit("active/clear");
    }
  }
}
