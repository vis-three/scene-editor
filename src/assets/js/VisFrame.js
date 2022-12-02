import {
  ModelingEngineSupport,
  History,
  MaterialDisplayer,
  TextureDisplayer,
  ENGINEPLUGIN,
} from "vis-three";
import Cookies from "js-cookie";
import { cameraDataSupport } from "../../store/modules/camera";
import { controlsDataSupport } from "../../store/modules/controls";
import { geometryDataSupport } from "../../store/modules/geometry";
import { lightDataSupport } from "../../store/modules/light";
import { materialDataSupport } from "../../store/modules/material";
import { meshDataSupport } from "../../store/modules/mesh";
import { textureDataSupport } from "../../store/modules/texture";
import { rendererDataSupport } from "../../store/modules/renderer";
import { defaultScene, sceneDataSupport } from "../../store/modules/scene";
import { css3DDataSupport } from "../../store/modules/css3D";
import { groupDataSupport } from "../../store/modules/group";
import { spriteDataSupport } from "../../store/modules/sprite";
import { lineDataSupport } from "../../store/modules/line";

import store from "../../store";
import { SelectionAction } from "./action/SelectionAction";
import { TransformAction } from "./action/TransformAction";
import { ChangeMaterialAction } from "./action/ChangeMaterialAction";
import { object3DDataSupport } from "../../store/modules/object3D";
import { ComponentManager } from "@/assets/js/plugins/ComponentMnanager";
import { CopyObjectAction } from "./action/CopyObjectAction";
import { ChangeComponentAction } from "./action/ChangeComponentAction";

window.VIS = {};

export const materialDisplayer = new MaterialDisplayer();
materialDisplayer.setSize(75, 55);

export const textureDisplayer = new TextureDisplayer();
textureDisplayer.setSize(75, 55);

export const engine = new ModelingEngineSupport({
  textureDataSupport,
  materialDataSupport,
  cameraDataSupport,
  lightDataSupport,
  geometryDataSupport,
  meshDataSupport,
  controlsDataSupport,
  rendererDataSupport,
  sceneDataSupport,
  css3DDataSupport,
  groupDataSupport,
  spriteDataSupport,
  lineDataSupport,
  object3DDataSupport,
})
  .install(ENGINEPLUGIN.CSS3DRENDERER)
  .install(ENGINEPLUGIN.CSS2DRENDERER);

engine.loaderManager
  .getLoader("glb")
  .dracoLoader.setDecoderPath("plugins/draco/gltf/");

engine.loaderManager.addEventListener("beforeLoad", () => {
  engine.loaderManager.setRequestHeader({
    Authorization: `Bearer ${Cookies.get("accessToken")}`,
  });
});

engine.eventManager.recursive = true;

engine.setScene(defaultScene.vid);

window.VIS.engine = engine;

export const history = new History(100);

window.VIS.history = history;

export const componentManager = new ComponentManager();

engine.componentManager = componentManager;

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

      console.log(object);
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
  });

// 物体选择
engine.addEventListener("selected", (event) => {
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
    store.commit(
      "active/object",
      engine.getConfigBySymbol(event.objectSymbols[0])
    );
  } else {
    store.commit("active/clear");
  }
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
