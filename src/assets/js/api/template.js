import { db } from "../db";

export default {
  async getStructure(classifyId = 0) {
    const list = await db.templateClassify
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
        ...(await db.template
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
      const parent = await db.templateClassify
        .where(id)
        .equals(parentId)
        .and((item) => !item.delete);

      if (parent) {
        params.level = parent.level + 1;
      }
    }

    const id = await db.templateClassify.add(params);

    params.id = id;
    params.dir = true;

    return params;
  },

  async creatTemplate({ name, classifyId, template, editor, preview }) {
    const params = {
      name,
      classifyId,
      template,
      editor,
      preview,
      delete: false,
    };

    const id = await db.template.add(params);

    params.id = id;

    return params;
  },

  async modifyTemplate({ id, name, template, editor, preview }) {
    return await db.template
      .where("id")
      .equals(Number(id))
      .modify({ name, template, editor, preview });
  },

  async getTemplate(id) {
    return await db.template.where("id").equals(Number(id)).first();
  },
};
