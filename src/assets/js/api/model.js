import { db } from "../db";

export default {
  async getStructure(classifyId = 0) {
    const list = await db.modelClassify
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
        ...(await db.model
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
      const parent = await db.modelClassify
        .where(id)
        .equals(parentId)
        .and((item) => !item.delete);

      if (parent) {
        params.level = parent.level + 1;
      }
    }

    const id = await db.modelClassify.add(params);

    params.id = id;
    params.dir = true;

    return params;
  },

  async uploadModel({ classifyId, name, model, ext, size, preview }) {
    const params = {
      classifyId,
      name,
      model,
      ext,
      preview,
      size,
      delete: false,
    };

    const id = await db.model.add(params);

    params.id = id;

    return params;
  },

  async getModel(id) {
    return await db.model.where("id").equals(id).first();
  },
};
