import { db } from "../db";

export default {
  async getStructure(classifyId = 0) {
    const list = await db.textureClassify
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
        ...(await db.texture
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
      const parent = await db.textureClassify
        .where(id)
        .equals(parentId)
        .and((item) => !item.delete);

      if (parent) {
        params.level = parent.level + 1;
      }
    }

    const id = await db.textureClassify.add(params);

    params.id = id;
    params.dir = true;

    return params;
  },
  async uploadTexture({ classifyId, name, texture, ext, size }) {
    const params = {
      classifyId,
      name,
      texture,
      ext,
      size,
      delete: false,
    };

    const id = await db.texture.add(params);

    params.id = id;

    return params;
  },

  async getTexture(id) {
    return await db.texture.where("id").equals(Number(id)).first();
  },
};
