import Vue from "vue";
import { ModelingEngineSupport } from "@vis-three/engine-modeling-support";
import {
  History,
  MaterialDisplayer,
  TextureDisplayer,
} from "@vis-three/convenient";
import * as AniScriptLibrary from "@vis-three/library-animate-script";
import * as EventLibrary from "@vis-three/library-event";
import * as ShaderLibrary from "@vis-three/library-shader";

import {
  AniScriptGeneratorManager,
  EventGeneratorManager,
  globalOption,
  ShaderGeneratorManager,
} from "@vis-three/middleware";

import { ComponentManager } from "@/assets/js/plugins/ComponentMnanager";

Object.values(AniScriptLibrary).forEach((config) => {
  AniScriptGeneratorManager.register(config);
});

Object.values(EventLibrary).forEach((config) => {
  EventGeneratorManager.register(config);
});

Object.values(ShaderLibrary).forEach((config) => {
  ShaderGeneratorManager.register(config);
});

window.VIS = {};

export const materialDisplayer = new MaterialDisplayer();
materialDisplayer.setSize(76, 55);

export const textureDisplayer = new TextureDisplayer();
textureDisplayer.setSize(76, 55);

globalOption.proxyExpand = Vue.observable;

export const engine = new ModelingEngineSupport();

engine.loaderManager
  .getLoader("glb")
  .dracoLoader.setDecoderPath("plugins/draco/gltf/");

engine.eventManager.recursive = true;

window.VIS.engine = engine;

export const history = new History(100);

window.VIS.history = history;

export const componentManager = new ComponentManager();

engine.componentManager = componentManager;
