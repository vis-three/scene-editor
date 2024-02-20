import { db } from "../db";

export default {
  async getStructure(classifyId = 0) {
    const list = await db.shaderClassify
      .where("parentId")
      .equals(classifyId)
      .and((item) => !item.delete)
      .toArray((arr) =>
        arr.map((item) => {
          item.dir = true;
          return item;
        }),
      );

    if (classifyId) {
      list.push(
        ...(await db.shader
          .where("classifyId")
          .equals(classifyId)
          .and((item) => !item.delete)
          .toArray()),
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
      const parent = await db.shaderClassify
        .where(id)
        .equals(parentId)
        .and((item) => !item.delete);

      if (parent) {
        params.level = parent.level + 1;
      }
    }

    const id = await db.shaderClassify.add(params);

    params.id = id;
    params.dir = true;

    return params;
  },
  async uploadShader({ classifyId, name, shader, preview, pkg, size }) {
    const params = {
      classifyId,
      name,
      shader,
      preview,
      pkg,
      size,
      delete: false,
    };

    const id = await db.shader.add(params);

    params.id = id;

    return params;
  },

  async getShader(id) {
    return await db.shader.where("id").equals(Number(id)).first();
  },
};
