import Vue from "vue";
import { DisplayEngineSupport } from "@vis-three/engine-display-support";

import * as AniScriptLibrary from "@vis-three/library-animate-script";
import EventLibrary from "@vis-three/library-event";

import {
  AniScriptGeneratorManager,
  defineOption,
  EventGeneratorManager,
} from "@vis-three/middleware";

import { ComponentManagerPlugin } from "@/assets/js/vis/plugins/ComponentManager";
import { CanvasManagerPlugin } from "@/assets/js/vis/plugins/CanvasManager";
import { ShaderManagerPlugin } from "@/assets/js/vis/plugins/ShaderManager";

import { GLTFLoader } from "@/assets/js/vis/loaders/GLTFLoader";

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

defineOption({
  proxy: {
    expand: Vue.observable,
    timing: "before",
  },
});

export const engine = new DisplayEngineSupport()
  .install(ComponentManagerPlugin())
  .install(CanvasManagerPlugin())
  .install(ShaderManagerPlugin());

const gltfLoader = new GLTFLoader();

gltfLoader.setDRACOLoader(new DRACOLoader());
gltfLoader.setKTX2Loader(new KTX2Loader());
gltfLoader.setMeshoptDecoder(MeshoptDecoder);
gltfLoader.dracoLoader.setDecoderPath("plugins/draco/gltf/");

engine.loaderManager.register("gltf", gltfLoader).register("glb", gltfLoader);

engine.eventManager.recursive = true;

window.VIS.engine = engine;
