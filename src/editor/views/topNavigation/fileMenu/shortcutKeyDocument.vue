<template>
  <el-dialog :visible.sync="visible" width="30vw" center>
    <div slot="title" class="dialog-title">
      <vis-icon code="#iconjiaohu" />
      快捷键说明
    </div>
    <el-table :data="tableData" height="50vh">
      <el-table-column prop="desp" label="描述" />
      <el-table-column prop="shortcutKey" label="快捷键">
        <template slot-scope="scope">
          <span>{{ scope.row.shortcutKey.join(" + ") }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { engine } from "@/editor/assets/js/vis";

export default {
  data() {
    const tableData = [
      {
        desp: "旋转画布",
        shortcutKey: ["鼠标右键"],
      },
      {
        desp: "缩放画布",
        shortcutKey: ["鼠标滚轮"],
      },
      {
        desp: "平移画布",
        shortcutKey: ["ctrl", "鼠标右键"],
      },
    ].concat(engine.keyboardManager.getDocs());
    return {
      visible: false,
      tableData,
    };
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
