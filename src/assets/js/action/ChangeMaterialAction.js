import { Action } from "@vis-three/convenient";
export class ChangeMaterialAction extends Action {
  constructor({ engine, objectSymbol, materialSymbol }) {
    super();
    this.engine = engine;
    this.objectSymbol = objectSymbol;
    this.materialSymbol = materialSymbol;
    this.oldMaterialSymbol = this.engine.getConfigBySymbol(
      this.objectSymbol
    ).material;
  }

  next() {
    const config = this.engine.getConfigBySymbol(this.objectSymbol);
    config.material = this.materialSymbol;
  }

  prev() {
    const config = this.engine.getConfigBySymbol(this.objectSymbol);
    config.material = this.oldMaterialSymbol;
  }
}
