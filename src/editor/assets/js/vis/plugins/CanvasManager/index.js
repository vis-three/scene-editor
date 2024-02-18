import { PLUGINS } from "@vis-three/middleware";
import { CanvasManager } from "./CanvasManager";
import { WEBGL_RENDERER_PLUGIN } from "@vis-three/plugin-webgl-renderer";

export const CanvasManagerPlugin = function () {
  let cacheExportConfigFun;
  let cacheLoadConfigAsyncFun;
  return {
    name: "CanvasManagerPlugin",
    deps: [...PLUGINS, WEBGL_RENDERER_PLUGIN],
    install(engine) {
      const canvasManager = new CanvasManager();
      engine.canvasManager = canvasManager;
      engine.generateCanvas = async function (url, pkg, config) {
        const msg = await this.canvasManager.generate(url, pkg, config);

        this.registerResources({
          [msg.config.$cid]: msg.canvas,
        });
        // msg.canvas.style.position = "fixed";
        // msg.canvas.style.top = 0;
        // msg.canvas.style.left = 0;
        // document.body.appendChild(msg.canvas);
        return msg;
      };

      cacheLoadConfigAsyncFun = engine.loadConfigAsync;

      engine.loadConfigAsync = async function (config) {
        let canvas;

        if (config.canvas) {
          canvas = await Promise.all(
            config.canvas.map((con) =>
              this.generateCanvas(con.$url, con.$pkg, con)
            )
          );
        }

        const loadResult = await cacheLoadConfigAsyncFun.call(this, config);

        loadResult.canvas = canvas || [];

        if (config.canvas) {
          config.texture
            .filter((c) => c.type === "CanvasTexture")
            .forEach((c) => {
              this.canvasManager.eventDocking(c.url, c);
            });
        }

        return loadResult;
      };

      cacheExportConfigFun = engine.exportConfig;

      engine.exportConfig = function (express) {
        const object = cacheExportConfigFun.call(this, express);

        const config = canvasManager.exportConfig();

        return Object.assign(object, config);
      };
    },
  };
};
