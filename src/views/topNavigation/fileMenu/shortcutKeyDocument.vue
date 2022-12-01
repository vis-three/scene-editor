<template>
  <el-dialog :visible.sync="visible" width="30vw" center>
    <div class="dialog-title" slot="title">
      <vis-icon code="#iconjiaohu"></vis-icon>
      快捷键说明
    </div>
    <el-table :data="tableData" height="50vh">
      <el-table-column prop="desp" label="描述"></el-table-column>
      <el-table-column prop="shortcutKey" label="快捷键">
        <template slot-scope="scope">
          <span>{{ scope.row.shortcutKey.join(" + ") }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { engine } from "../../../assets/js/VisFrame";

export default {
  data() {
    return {
      visible: false,
      tableData: engine.keyboardManager.getDocs()
    };
  }
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
