<template>
  <de-collapse-layout :icon="icon" :label="label">
    <template #container>
      <div class="basicElement-main">
        <div
          class="basicELement-elem"
          v-for="(item, index) in dataList"
          :key="index"
          @click="clickItem(item)"
        >
          <div class="element-icon-box">
            <vis-icon :code="item.icon"></vis-icon>
          </div>
          <div class="element-title" v-text="item.label"></div>
        </div>
      </div>
    </template>
  </de-collapse-layout>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: "#iconkucunfenxi",
    },
    label: {
      type: String,
      default: "参数几何",
    },
    dataList: {
      type: Array,
      default: () => [],
    },
    clickHanlder: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    clickItem(item) {
      this.clickHanlder.call(this, item);
    },
  },
};
</script>

<style lang="less" scoped>
@boxWidth: 80px;

.collapseLayout-container {
  margin-bottom: 0;
}
.basicElement-main {
  .flexLayout(row, flex-start, center);
  flex-wrap: wrap;
  width: 100%;

  .basicELement-elem:nth-child(n * 4) {
    margin-right: 0;
  }
  .basicELement-elem {
    margin: 0 @box-margin / 2 @box-margin 0;
    cursor: pointer;
    > .element-icon-box {
      .boxSetting(@boxWidth, 60px);
      background: @brighterTheme-backgroundColor;
      margin-bottom: @box-margin;
      .flexLayout(row, center, center);
      .transitionSetting({background: @themeHover-color;});
      .icon-container {
        font-size: 22px;
      }
    }
    > .element-title {
      width: @boxWidth;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
