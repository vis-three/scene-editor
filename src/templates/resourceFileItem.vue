<template>
  <div class="resourceFileItem-container">
    <template v-if="file.dir">
      <vis-icon :size="iconSize" code="#iconwenjianjia"></vis-icon>
    </template>
    <template v-else>
      <el-image
        :style="{
          maxWidth: iconSize,
          maxHeight: iconSize,
        }"
        v-if="['jpg', 'jpeg', 'png'].includes(file.ext.toLocaleLowerCase())"
        :src="file.url"
      ></el-image>
      <vis-icon
        v-else
        :size="iconSize"
        :code="fileIcon[file.ext] || '#iconwenjian1'"
      ></vis-icon>
    </template>
    <span class="item-title" v-text="file.name"></span>
  </div>
</template>

<script>
export default {
  props: {
    file: {
      type: Object,
      default: () => {
        return {
          dir: true,
          url: "",
          name: "文件夹",
          ext: "",
        };
      },
    },
  },
  data() {
    return {
      iconSize: "45px",
      timer: "",
      fileIcon: {
        mtl: "#iconmtl",
      },
    };
  },
};
</script>

<style lang="less" scoped>
.resourceFileItem-container {
  .flexLayout(column, space-between, center);
  .boxSetting(90px, 100px, @box-padding);
  margin: 0 @box-margin @box-margin 0;
  cursor: pointer;
  .transitionSetting({background: @themeDarkHover-color;});
  .item-title {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }
}
</style>
