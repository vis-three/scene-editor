import { engine, history } from "./vis";
import store from "../../store";
import { SelectionAction } from "./action/SelectionAction";
import { TransformAction } from "./action/TransformAction";
import { ChangeMaterialAction } from "./action/ChangeMaterialAction";
import { CopyObjectAction } from "./action/CopyObjectAction";
import { ChangeComponentAction } from "./action/ChangeComponentAction";
import { DeleteObjectAction } from "./action/DeleteObjectAction";

// 快捷键设置
engine.keyboardManager
  .register({
    shortcutKey: ["ctrl", "y"],
    desp: "恢复",
    keydown: (event) => {
      event.preventDefault();
      event.stopPropagation();
      store.commit("history/redoStatus", true);
      store.commit("history/redo");
    },
    keyup: (event) => {
      event.preventDefault();
      event.stopPropagation();
      store.commit("history/redoStatus", false);
    },
  })
  .register({
    shortcutKey: ["ctrl", "z"],
    desp: "撤销",
    keydown: (event) => {
      event.preventDefault();
      event.stopPropagation();
      store.commit("history/undoStatus", true);
      store.commit("history/undo");
    },
    keyup: (event) => {
      event.preventDefault();
      event.stopPropagation();
      store.commit("history/undoStatus", false);
    },
  })
  .register({
    shortcutKey: ["ctrl", "c"],
    desp: "复制",
    keyup: (event) => {
      event.preventDefault();
      event.stopPropagation();

      const object = store.getters["active/object"];
      object && (CopyObjectAction.tempSymbol = object.vid);
    },
  })
  .register({
    shortcutKey: ["ctrl", "v"],
    desp: "粘贴",
    keyup: (event) => {
      event.preventDefault();
      event.stopPropagation();

      history.apply(new CopyObjectAction({ store, engine }), true);
    },
  })
  .register({
    shortcutKey: ["d"],
    desp: "删除物体",
    keyup: (event) => {
      event.preventDefault();
      event.stopPropagation();

      const object = store.getters["active/object"];

      if (object) {
        history.apply(
          new DeleteObjectAction({
            store,
            engine,
            objectSymbol: object.vid,
          }),
          true
        );
      }
    },
  });

// 物体选择
engine.addEventListener("selected", (event) => {
  engine.pathSupportControls.visible = false;
  engine.pathSupportControls.disconnect();

  if (!SelectionAction.cacheSymbolBox.length && !event.objectSymbols.length) {
    return;
  }

  if (SelectionAction.touch) {
    SelectionAction.touch = false;
    return;
  }

  history.apply(
    new SelectionAction({ engine, objectSymbols: event.objectSymbols, store })
  );

  if (event.objectSymbols.length === 1) {
    const obejctConfig = engine.getConfigBySymbol(event.objectSymbols[0]);

    store.commit("active/object", obejctConfig);

    const geometryConfig = obejctConfig.geometry
      ? engine.getConfigBySymbol(obejctConfig.geometry)
      : null;

    if (geometryConfig && geometryConfig.type === "PathGeometry") {
      const pathConfig = engine.getConfigBySymbol(geometryConfig.path);

      engine.pathSupportControls.visible = true;
      engine.pathSupportControls
        .setConfig(pathConfig)
        .setObject(event.objects[0])
        .connect();
    }
  } else {
    store.commit("active/clear");
  }
});

// 路径编辑
engine.pathSupportControls.addEventListener("mousedown", (event) => {
  engine.selectionDisable = true;

  engine.eventManager.once("click", (event) => {
    engine.selectionDisable = false;
  });
});

// 物体基础变换
let transformAction = "";
engine.transformControls.addEventListener("mouseDown", (event) => {
  transformAction = new TransformAction({
    engine,
    transformControls: event.target,
  });
  transformAction.generate("prev");
});

engine.transformControls.addEventListener("mouseUp", (event) => {
  transformAction.generate("next");
  history.apply(transformAction);
  transformAction = "";
});

engine.eventManager.addEventListener("pointerup", (event) => {
  if (event.button === 0) {
    // 选择
    if (event.intersections && event.intersections.length) {
      const intersection = event.intersections[0];

      const object = intersection.object;

      const vid = engine.compilerManager.getObjectSymbol(object);

      if (vid) {
        // 材质替换 组件替换
        if (store.getters["material/dragging"]) {
          history.apply(
            new ChangeMaterialAction({
              engine,
              objectSymbol: vid,
              materialSymbol: store.getters["active/material"].vid,
            }),
            true
          );
          store.commit("material/dragging", false);
        } else if (
          store.getters["component/dragging"] &&
          (object.isCSS3DObject || object.isCSS2DObject)
        ) {
          console.log(store.getters["component/draggedComponentItem"]);
          const action = new ChangeComponentAction({
            engine,
            store,
            componentItem: store.getters["component/draggedComponentItem"],
            objectSymbol: vid,
          });

          action.generateComponent().then(() => {
            history.apply(action, true);
            store.commit("component/dragging", false);
          });
        }
      }
    }
  }
});
