import Dexie from "dexie";

export const db = new Dexie("vis");

db.version(1).stores({
  appClassify: "++id, name, parentId, level, delete",
  app: "++id, classifyId, name, app, editor, preview, delete",
  modelClassify: "++id, name, parentId, level, delete",
  model: "++id, classifyId, name, model, ext, preview, size, delete",
  textureClassify: "++id, name, parentId, level, delete",
  texture: "++id, classifyId, name, texture, ext, size, delete",
  componentClassify: "++id, name, parentId, level, delete",
  component: "++id, classifyId, name, component, pkg, preview, size, delete",
  templateClassify: "++id, name, parentId, level, delete",
  template: "++id, classifyId, name, template, editor, preview, delete",
  canvasClassify: "++id, name, parentId, level, delete",
  canvas: "++id, classifyId, name, canvas, pkg, preview, size, delete",
});
