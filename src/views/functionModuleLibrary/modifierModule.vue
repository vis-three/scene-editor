<template>
  <div class="modifierModule-container" v-show="config">
    <div class="eventSetting-title">
      <vis-icon code="#iconjihetuxing"></vis-icon>
      <de-controller-input
        label="名称"
        v-model="config.name"
      ></de-controller-input>
    </div>

    <el-popover
      placement="bottom"
      width="200"
      trigger="click"
      v-model="visible"
    >
      <el-cascader-panel
        v-model="cascaderValue"
        :options="modifierOptions"
        @change="change"
      ></el-cascader-panel>

      <el-button slot="reference" type="primary" size="mini">
        添加修改器
      </el-button>
    </el-popover>

    <div class="modifier-item" v-for="item in modifierList" :key="item.vid">
      <components :is="item.type" :config="item"></components>
      <div class="operation-box">
        <vis-icon code="#iconsanjiaojiantoushang"></vis-icon>
        <vis-icon code="#iconsanjiaojiantouxia"></vis-icon>
        <vis-icon code="#iconshanchu"></vis-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { CONFIGTYPE, generateConfig } from "@vis-three/middleware";

const context = import.meta.glob("./modifierModule/*.vue");

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
      modifierOptions: [
        {
          label: "布尔修改器",
          value: CONFIGTYPE.BOOLEANMODIFIER,
        },
      ],
    };
  },
  computed: {
    config() {
      return this.$store.getters["active/object"];
    },
    modifierList() {
      return Object.values(this.$store.getters["modifier/get"]).filter(
        (elem) => elem.source === this.config.vid
      );
    },
  },
  methods: {
    change(value) {
      if (!value[0]) {
        return;
      }

      const config = generateConfig(value[0], {
        source: this.config.vid,
      });

      config.name = `${
        this.modifierOptions.find((elem) => elem.value === value[0]).label
      }-${config.vid.slice(-2)}`;

      console.log(config);

      this.$store.commit("modifier/add", config);

      this.cascaderValue = [];
      this.visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.modifierModule-container {
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

.modifier-item {
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
