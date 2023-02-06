<template>
  <div class="helperModel-container">
    <de-collapse-layout icon="#icondengpao" label="辅助">
      <template #container>
        <div class="helperModel-main">
          <div
            class="helperModel-elem"
            v-for="(item, index) in helperModel"
            :key="index"
            @click="addHelperModel(item)"
          >
            <div class="element-icon-box">
              <vis-icon :code="item.icon"></vis-icon>
            </div>
            <div class="element-title" v-text="item.label"></div>
          </div>
        </div>
      </template>
    </de-collapse-layout>
  </div>
</template>

<script>
import { v4 as getUuid } from "uuid";

export default {
  data() {
    return {
      // helperModel,
    };
  },
  methods: {
    addHelperModel(item) {
      const config = item.getConfig();
      config.vid = getUuid();
      config.icon = item.icon;
      config.name = `${item.label}${config.vid.slice(-2)}`;

      this.$store.commit("action/helperModelAdd", config);
    },
  },
};
</script>

<style lang="less" scoped>
@boxWidth: 75px;
.helperModel-main {
  .flexLayout(row, space-around, center);
  flex-wrap: wrap;
  width: 100%;
  .helperModel-elem {
    margin-bottom: @box-margin;
    cursor: pointer;
    > .element-icon-box {
      .boxSetting(@boxWidth, 55px);
      background: @brighterTheme-backgroundColor;
      margin-bottom: @box-margin;
      .flexLayout(row, center, center);
      .transitionSetting({background: @themeHover-color;});
      .icon-container {
        font-size: 34px;
      }
    }
    > .element-title {
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
