import { PLUGINS } from "@vis-three/middleware";
import { WEBGL_RENDERER_PLUGIN } from "@vis-three/plugin-webgl-renderer";
import { ShaderManager } from "./ShaderManager";

export const ShaderManagerPlugin = function () {
  let cacheExportConfigFun;
  let cacheLoadConfigAsyncFun;
  return {
    name: "ShaderManagerPlugin",
    deps: [...PLUGINS, WEBGL_RENDERER_PLUGIN],
    install(engine) {
      const shaderManager = new ShaderManager();
      engine.shaderManager = shaderManager;
      engine.generateShader = async function (url, pkg, vid, config) {
        const msg = await this.shaderManager.generate(url, pkg, vid, config);
        return msg;
      };

      cacheLoadConfigAsyncFun = engine.loadConfigAsync;

      engine.loadConfigAsync = async function (config) {
        let shaders;

        if (config.shaderAssets) {
          await this.shaderManager.loadList(config.shaderAssets);

          if (config.material) {
            shaders = config.material
              .filter((c) => c.type === "ShaderMaterial")
              .map((c) => ({
                config: c,
                packageJSON: this.shaderManager.getPkgByName(c.shader),
              }));
          }
        }

        const loadResult = await cacheLoadConfigAsyncFun.call(this, config);

        loadResult.shaders = shaders || [];

        return loadResult;
      };

      cacheExportConfigFun = engine.exportConfig;

      engine.exportConfig = function (express) {
        const object = cacheExportConfigFun.call(this, express);

        const config = this.shaderManager.exportConfig();

        return Object.assign(object, config);
      };
    },
  };
};
