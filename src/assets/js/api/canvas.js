import { db } from "../db";

export default {
  async getStructure(classifyId = 0) {
    const list = await db.canvasClassify
      .where("parentId")
      .equals(classifyId)
      .and((item) => !item.delete)
      .toArray((arr) =>
        arr.map((item) => {
          item.dir = true;
          return item;
        })
      );

    if (classifyId) {
      list.push(
        ...(await db.canvas
          .where("classifyId")
          .equals(classifyId)
          .and((item) => !item.delete)
          .toArray())
      );
    }
    return list;
  },

  async addClassify({ parentId = 0, name }) {
    const params = {
      parentId,
      name,
      delete: false,
      level: 0,
    };

    if (parentId) {
      const parent = await db.canvasClassify
        .where(id)
        .equals(parentId)
        .and((item) => !item.delete);

      if (parent) {
        params.level = parent.level + 1;
      }
    }

    const id = await db.canvasClassify.add(params);

    params.id = id;
    params.dir = true;

    return params;
  },

  async uploadCanvas({ classifyId, name, canvas, pkg, size, preview }) {
    const params = {
      classifyId,
      name,
      canvas,
      pkg,
      preview,
      size,
      delete: false,
    };

    const id = await db.canvas.add(params);

    params.id = id;

    return params;
  },

  async getCanvas(id) {
    return await db.canvas.where("id").equals(Number(id)).first();
  },
};
