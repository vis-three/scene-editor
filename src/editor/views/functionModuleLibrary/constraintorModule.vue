<template>
  <div
    v-show="config"
    class="constraintorModule-container"
  >
    <div class="eventSetting-title">
      <vis-icon code="#iconjihetuxing" />
      <de-controller-input
        v-model="config.name"
        label="名称"
      />
    </div>

    <el-popover
      v-model="visible"
      placement="bottom"
      width="200"
      trigger="click"
    >
      <el-cascader-panel
        v-model="cascaderValue"
        :options="constraintorOptions"
        @change="change"
      />

      <el-button
        slot="reference"
        type="primary"
        size="mini"
      >
        添加约束器
      </el-button>
    </el-popover>

    <div
      v-for="item in constraintorList"
      :key="item.vid"
      class="constraintor-item"
    >
      <components
        :is="item.type"
        :config="item"
      />
      <div class="operation-box">
        <vis-icon code="#iconsanjiaojiantoushang" />
        <vis-icon code="#iconsanjiaojiantouxia" />
        <vis-icon
          code="#iconshanchu"
          @click.native="deleteConstraintor(item)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { CONFIGTYPE, generateConfig } from "@vis-three/middleware";
import { engine } from "../../assets/js/vis";

const context = import.meta.glob("./constraintorModule/*.vue");

const components = {};

Object.keys(context).forEach((url) => {
  components[
    url
      .split("/")
      .pop()
      .replace(/.\/|\.vue$/g, "")
  ] = context[url];
});

export default {
  components,
  data() {
    return {
      visible: false,
      cascaderValue: [],
      constraintorOptions: [
        {
          label: "数值约束",
          value: CONFIGTYPE.NUMBERCONSTRAINTOR,
          merge: () => ({
            offset: {
              operate: "+",
              value: 0,
            },
          }),
        },
        {
          label: "包围盒约束",
          value: CONFIGTYPE.BOUNDINGBOXCONSTRAINTOR,
          merge: () => ({}),
        },
      ],
    };
  },
  computed: {
    config() {
      return this.$store.getters["active/object"];
    },
    constraintorList() {
      return Object.values(this.$store.getters["constraintor/get"]).filter(
        (elem) => elem.target === this.config.vid
      );
    },
  },
  methods: {
    change(value) {
      if (!value[0]) {
        return;
      }

      const item = this.constraintorOptions.find(
        (item) => (item.value = value[0])
      );

      const config = generateConfig(value[0], {
        target: this.config.vid,
        ...item.merge(),
      });

      config.name = `${
        this.constraintorOptions.find((elem) => elem.value === value[0]).label
      }-${config.vid.slice(-2)}`;

      console.log(config);

      this.$store.commit("constraintor/add", config);

      this.cascaderValue = [];
      this.visible = false;
    },
    deleteConstraintor(item) {
      this.$store.commit("constraintor/remove", item.vid);
    },
  },
};
</script>

<style lang="less" scoped>
.constraintorModule-container {
  padding: @box-padding;

  .el-button {
    width: 100%;
  }
}
.eventSetting-title {
  .flexLayout();
  .icon-container {
    color: @theme-color;
    margin-right: (@box-margin / 2);
  }
}

.constraintor-item {
  .flexLayout(row, center, stretch);
  margin: @box-margin 0;
  background-color: @brighterTheme-backgroundColor;

  > div:first-child {
    height: 100%;
    padding: @box-padding;
  }
}

.operation-box {
  .flexLayout(column);
  .icon-container {
    .flexLayout(row, center, center);
    padding: (@box-padding / 2);
    flex: 1;
    background-color: @brightestTheme-backgroundColor;
    cursor: pointer;
  }

  .icon-container:last-child {
    background-color: @error-color;
  }
}
</style>
