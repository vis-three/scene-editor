import Dexie from "dexie";

export const db = new Dexie("vis");

db.version(1).stores({
  modelClassify: "++id, name, parentId, level, delete",
  model: "++id, classifyId, name, model, ext, preview, size, delete",
  textureClassify: "++id, name, parentId, level, delete",
  texture: "++id, classifyId, name, texture, ext, size, delete",
});
