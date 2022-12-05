<template>
  <div class="effectPassLibrary-container">
    <div class="box-header">
      <el-input
        size="mini"
        prefix-icon="el-icon-search"
        placeholder="插件筛选"
      ></el-input>
      <el-dropdown trigger="click" @command="addPass">
        <el-button
          size="mini"
          icon="el-icon-circle-plus-outline"
          type="primary"
        >
          添加插件
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in pass"
            :key="index"
            v-text="item.label"
            :command="item"
          ></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div class="box-container">
      <el-tree :data="passList" node-key="vid" @node-click="nodeClick">
        <span
          class="custom-tree-node"
          :class="{ active: currentPass && data.vid === currentPass.vid }"
          slot-scope="{ data }"
        >
          <span class="message-box">
            <span>{{ data.name }}</span>
          </span>
          <span class="operate-box" @click="removePass(data)">
            <vis-icon
              code="#iconshanchu"
              :color="
                data.vid === (currentPass && currentPass.vid) ? null : '#FF4C4C'
              "
            ></vis-icon>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { CONFIGTYPE, generateConfig } from "vis-three";
import Vue from "vue";

export default {
  components: {},
  data() {
    return {
      pass: [
        {
          label: "虚幻光影",
          value: "",
          type: CONFIGTYPE.UNREALBLOOMPASS,
        },
        {
          label: "选择光影",
          value: "",
          type: CONFIGTYPE.SELECTIVEBLOOMPASS,
        },
        {
          label: "SMAA",
          value: "",
          type: CONFIGTYPE.SMAAPASS,
        },
      ],
      chouseValue: "",
    };
  },
  computed: {
    passList() {
      return Object.values(this.$store.getters["pass/get"]);
    },
    currentPass() {
      return this.$store.getters["active/pass"];
    },
  },
  methods: {
    addPass(command) {
      const config = generateConfig(command.type, undefined, {
        handler: (c) => Vue.observable(c),
      });
      config.name = `${command.label}-${config.vid.slice(-2)}`;
      console.log(config);
      this.$store.commit("pass/add", config);
    },
    removePass(data) {
      console.log(data);
      this.$confirm(`是否删除后期：${data.name}。`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (this.currentPass.vid === data.vid) {
          this.$store.commit("active/pass", "");
        }
        this.$store.commit("pass/remove", data.vid);
      });
    },
    nodeClick(data) {
      const config = this.$store.getters["pass/get"][data.vid];
      this.$store.commit("active/pass", config);
    },
  },
};
</script>

<style lang="less" scoped>
.effectPassLibrary-container {
  padding: @box-padding;
  .box-header {
    .flexLayout(row, space-between, center);
    margin-bottom: @box-margin;
    > .el-input {
      margin-right: @box-margin;
    }
  }

  .box-container {
    /deep/ .el-tree-node__content {
      position: relative;
      margin-bottom: 1px;
      .el-tree-node__expand-icon {
        position: absolute;
      }
    }
    .custom-tree-node {
      .boxSetting();
      .flexLayout(row, space-between, center);
      padding-left: 24px;
      /deep/ .icon-container {
        margin-right: @box-margin / 2;
      }
    }

    .active {
      background: @theme-color;
    }
  }
}
</style>
