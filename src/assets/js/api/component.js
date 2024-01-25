import { db } from "../db";

export default {
  async getStructure(classifyId = 0) {
    const list = await db.componentClassify
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
        ...(await db.component
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
      const parent = await db.componentClassify
        .where(id)
        .equals(parentId)
        .and((item) => !item.delete);

      if (parent) {
        params.level = parent.level + 1;
      }
    }

    const id = await db.componentClassify.add(params);

    params.id = id;
    params.dir = true;

    return params;
  },

  async uploadComponent({ classifyId, name, component, pkg, size, preview }) {
    const params = {
      classifyId,
      name,
      component,
      pkg,
      preview,
      size,
      delete: false,
    };

    const id = await db.component.add(params);

    params.id = id;

    return params;
  },

  async getComponent(id) {
    return await db.component.where("id").equals(Number(id)).first();
  },
};
