import { PLUGINS } from "@vis-three/middleware";
import { ComponentManager } from "./ComponentMnanager";
import { CSS3D_RENDERER_PLUGIN } from "@vis-three/plugin-css3d-renderer";
import { CSS2D_RENDERER_PLUGIN } from "@vis-three/plugin-css2d-renderer";
import { WEBGL_RENDERER_PLUGIN } from "@vis-three/plugin-webgl-renderer";
import html2canvas from "html2canvas";

export const ComponentManagerPlugin = function () {
  let cacheExportConfigFun;
  let cacheLoadConfigAsyncFun;
  let cacheGetScreeshotFun;
  return {
    name: "ComponentManagerPlugin",
    deps: [
      ...PLUGINS,
      CSS3D_RENDERER_PLUGIN,
      CSS2D_RENDERER_PLUGIN,
      WEBGL_RENDERER_PLUGIN,
    ],
    install(engine) {
      const componentManager = new ComponentManager();
      engine.componentManager = componentManager;

      engine.generateComponent = async function (url, pkg, config) {
        const msg = await this.componentManager.generate(url, pkg, config);

        this.registerResources({
          [msg.config.$cid]: msg.resource,
        });

        return msg;
      };

      cacheLoadConfigAsyncFun = engine.loadConfigAsync;

      engine.loadConfigAsync = async function (config) {
        let component;

        if (config.component) {
          component = await Promise.all(
            config.component.map((con) =>
              this.generateComponent(con.$url, con.$pkg, con)
            )
          );
        }

        const loadResult = await cacheLoadConfigAsyncFun.call(this, config);

        loadResult.component = component || [];

        return loadResult;
      };

      cacheExportConfigFun = engine.exportConfig;

      engine.exportConfig = function (express) {
        const object = cacheExportConfigFun.call(this, express);

        const config = componentManager.exportConfig();

        object.component = config;

        return object;
      };

      cacheGetScreeshotFun = engine.getScreenshot;

      engine.getScreenshot = async function (params) {
        const cacheSize = {
          width: this.dom.offsetWidth,
          height: this.dom.offsetHeight,
        };

        !params.width && (params.width = this.dom.offsetWidth);
        !params.height && (params.height = this.dom.offsetHeight);
        !params.mine && (params.mine = "image/png");

        const tempCanvas = document.createElement("canvas");
        tempCanvas.setAttribute("width", params.width.toString());
        tempCanvas.setAttribute("height", params.height.toString());
        const ctx = tempCanvas.getContext("2d");

        this.setSize(params.width, params.height);

        const css2d = await html2canvas(document.querySelector(".vis-css2D"), {
          backgroundColor: null,
        });

        const css3d = await html2canvas(document.querySelector(".vis-css3D"), {
          backgroundColor: null,
        });

        const webglData = await cacheGetScreeshotFun.call(this, params);

        this.setSize(cacheSize.width, cacheSize.height);

        const webgl = new Image();
        webgl.src = webglData;

        await new Promise((resolve, reject) => {
          webgl.onload = (webgl) => {
            ctx.drawImage(webgl.target, 0, 0, params.width, params.height);
            ctx.drawImage(css2d, 0, 0, params.width, params.height);
            ctx.drawImage(css3d, 0, 0, params.width, params.height);
            resolve();
          };
        });

        return tempCanvas.toDataURL(params.mine);
      };
    },
  };
};
