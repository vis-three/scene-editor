import Vue from "vue";
import { ModelingEngineSupport } from "@vis-three/engine-modeling-support";
import {
  History,
  MaterialDisplayer,
  TextureDisplayer,
} from "@vis-three/convenient";
import * as AniScriptLibrary from "@vis-three/library-animate-script";
import EventLibrary from "@vis-three/library-event";

import {
  AniScriptGeneratorManager,
  defineOption,
  EventGeneratorManager,
} from "@vis-three/middleware";

import { PathSupportControlsPlugin } from "@vis-three/plugin-path-support-controls";
import { ComponentManagerPlugin } from "./plugins/ComponentManager";

import { GLTFLoader } from "./loaders/GLTFLoader";

import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";

Object.values(AniScriptLibrary).forEach((config) => {
  AniScriptGeneratorManager.register(config);
});

Object.values(EventLibrary).forEach((config) => {
  EventGeneratorManager.register(config);
});

window.VIS = {};

export const materialDisplayer = new MaterialDisplayer();
materialDisplayer.setSize(76, 55);

export const textureDisplayer = new TextureDisplayer();
textureDisplayer.setSize(76, 55);

defineOption({
  proxy: {
    expand: Vue.observable,
    timing: "before",
  },
});

export const engine = new ModelingEngineSupport()
  .install(PathSupportControlsPlugin())
  .install(ComponentManagerPlugin());

const gltfLoader = new GLTFLoader();

gltfLoader.setDRACOLoader(new DRACOLoader());
gltfLoader.setKTX2Loader(new KTX2Loader());
gltfLoader.setMeshoptDecoder(MeshoptDecoder);
gltfLoader.dracoLoader.setDecoderPath("plugins/draco/gltf/");

engine.loaderManager.register("gltf", gltfLoader).register("glb", gltfLoader);

engine.eventManager.recursive = true;

engine.eventManager.addFilterObject(engine.pathSupportControls);

window.VIS.engine = engine;

export const history = new History(100);

window.VIS.history = history;
