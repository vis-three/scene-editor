import { db } from "../db";

export default {
  async getStructure(classifyId = 0) {
    const list = await db.appClassify
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
        ...(await db.app
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
      const parent = await db.appClassify
        .where(id)
        .equals(parentId)
        .and((item) => !item.delete);

      if (parent) {
        params.level = parent.level + 1;
      }
    }

    const id = await db.appClassify.add(params);

    params.id = id;
    params.dir = true;

    return params;
  },

  async creatApp({ classifyId, name }) {
    const params = {
      classifyId,
      name,
      app: {},
      editor: {},
      preview: null,
      delete: false,
    };

    const id = await db.app.add(params);

    params.id = id;

    return params;
  },

  async saveApp({ id, name, app, editor, preview }) {
    return await db.app
      .where("id")
      .equals(id)
      .modify({ name, app, editor, preview });
  },

  async getApp(id) {
    return await db.app.where("id").equals(Number(id)).first();
  },
};
