<template>
  <div class="LineCurveGeometry-container">
    <de-collapse-layout
      label="路径"
      icon="#iconjichubianhuan"
      arrow-position="left"
    >
      <template #container>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-circle-plus-outline"
          class="path-add"
          @click="addPoint"
        >
          添加路径
        </el-button>

        <div
          v-for="(item, index) in config.path"
          :key="index"
          class="path-point-item"
        >
          <de-controller-vector3
            :keyframe="false"
            :label="'锚点' + index"
            :step="1"
            :display-accuracy="2"
            :value="item"
          />

          <i
            v-show="config.path.length > 2"
            class="el-icon-delete"
            @click="deletePoint(index)"
          />
        </div>
      </template>
    </de-collapse-layout>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },

  methods: {
    addPoint() {
      this.config.path.push({
        x: 0,
        y: 0,
        z: 0,
      });
    },

    deletePoint(index) {
      this.config.path.splice(index, 1);
    },
  },
};
</script>

<style lang="less" scoped>
.path-add {
  margin-bottom: (@box-margin / 2);
}

.path-point-item {
  .flexLayout(row, space-between, center);
  > i {
    padding: (@box-padding / 2);
    color: @error-color;
    cursor: pointer;
  }
}

.path-add,
.path-point-item {
  width: 100%;
}
</style>
