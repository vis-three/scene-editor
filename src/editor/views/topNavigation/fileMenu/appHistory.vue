<template>
  <el-dialog :visible.sync="visible" width="600px" center>
    <div slot="title" class="dialog-title">
      <vis-icon code="#iconjiaohu" />
      应用历史
    </div>

    <el-table :data="tableData" height="50vh">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="项目名"></el-table-column>
      <el-table-column prop="mode" label="模式">
        <template slot-scope="scope">
          <span>{{ scope.row.mode === "auto" ? "自动保存" : "手动保存" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="保存时间">
        <template slot-scope="scope">
          <span>{{ getDate(scope.row.date) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="applyHistory(scope.row)"
          >
            应用
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="page"
      @current-change="change"
    ></el-pagination>
  </el-dialog>
</template>

<script>
import historyApi from "@/assets/js/api/history.js";

export default {
  data() {
    return {
      visible: false,
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      mode: "",
    };
  },

  mounted() {
    this.queryList();
  },
  methods: {
    getDate(time) {
      return new Date(time).toLocaleString();
    },
    async queryList() {
      const msg = await historyApi
        .getListByMode({
          mode: this.mode,
          page: this.page,
          pageSize: this.pageSize,
          appId: this.$store.getters.id,
        })
        .catch((err) => {
          this.$message.error("接口有误：historyApi/getListByMode");
          console.error(err);
        });

      this.tableData = msg.list;
      this.total = msg.total;
    },

    change(page) {
      this.page = page;
      this.queryList();
    },

    applyHistory(data) {
      window.location.href = `${window.location.origin}${window.location.pathname}?id=${data.appId}&history=${data.id}`;
    },
  },
};
</script>

<style lang="less" scoped>
.dialog-title {
  font-size: 16px;
  .icon-container {
    color: @theme-color;
  }
}
</style>
