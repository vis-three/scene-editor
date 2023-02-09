import { Action } from "@vis-three/convenient";

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

    this.engine.setSelectionBoxBySymbol(this.newSymbolBox);

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

    this.engine.setSelectionBoxBySymbol(this.oldSymbolBox);

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
