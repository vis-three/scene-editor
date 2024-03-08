import { db } from "../db";

const limitNumber = async function (appId) {
  const limit = 30;
  const total = await db.history.where("appId").equals(Number(appId)).count();

  if (total >= limit) {
    const list = await db.history
      .where("appId")
      .equals(Number(appId))
      .sortBy("id");

    await db.history.bulkDelete(
      list.slice(0, total - limit).map((item) => item.id),
    );
  }
};

export default {
  async creatHistory({ appId, date, name, app, editor, preview = "", mode }) {
    const params = {
      appId,
      date,
      name,
      app,
      editor,
      preview,
      mode,
      delete: false,
    };

    const id = await db.history.add(params);

    params.id = id;

    await limitNumber(appId);

    return params;
  },

  async getListByMode({ appId, mode, page, pageSize }) {
    let list = [];

    list = await db.history
      .where("appId")
      .equals(Number(appId))
      .and((item) => {
        if (mode) {
          return item.delete === false && mode === mode;
        } else {
          return item.delete === false;
        }
      })
      .offset(pageSize * (page - 1))
      .limit(pageSize)
      .toArray();

    const total = await db.history
      .where("appId")
      .equals(Number(appId))
      .and((item) => {
        return item.delete === false;
      })
      .count();

    return { list, total };
  },

  async getHistory(id) {
    return await db.history.where("id").equals(Number(id)).first();
  },
};
