<template>
  <div class="geometrySettingModule-container" v-if="config">
    <de-collapse-layout
      label="几何基础"
      icon="#iconshezhi"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-input
          label="几何名称"
          v-model="config.name"
        ></de-controller-input>
        <de-controller-vector3
          :keyframe="false"
          label="锚点位置"
          :step="0.1"
          :displayAccuracy="displayAccuracy"
          v-model="config.position"
        ></de-controller-vector3>
        <de-controller-vector3
          :keyframe="false"
          label="锚点缩放"
          :step="1"
          :displayAccuracy="displayAccuracy"
          v-model="config.scale"
        ></de-controller-vector3>
        <de-controller-vector3
          :keyframe="false"
          label="锚点旋转"
          :step="1"
          :displayAccuracy="displayAccuracy"
          unit="°"
          v-model="config.rotation"
        ></de-controller-vector3>
        <de-controller-switch
          :keyframe="false"
          label="居中"
          v-model="config.center"
        ></de-controller-switch>

        <div class="geometry-groups">
          <el-button
            icon="el-icon-circle-plus-outline"
            size="mini"
            type="primary"
            class="add-group"
            @click="addGroup"
          >
            添加几何组
          </el-button>
          <div
            class="geometry-group-item"
            v-for="(item, index) in config.groups"
            :key="index"
          >
            <div class="group-controller">
              <de-controller-number
                :keyframe="false"
                label="起始顶点"
                :step="1"
                :min="0"
                v-model="item.start"
              ></de-controller-number>
              <de-controller-number
                :keyframe="false"
                label="结束顶点"
                :step="1"
                :min="Infinity"
                v-model="item.count"
              ></de-controller-number>
              <de-controller-number
                :keyframe="false"
                label="材质索引"
                :step="1"
                :min="0"
                v-model="item.materialIndex"
              ></de-controller-number>
            </div>

            <el-popconfirm
              title="确定删除当下几何组吗？"
              @confirm="deleteGroup(index)"
            >
              <div class="group-operation" slot="reference">
                <i class="el-icon-delete"></i>
              </div>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </de-collapse-layout>

    <component :is="component" :config="config"></component>
  </div>
</template>

<script>
const components = {};

const context = import.meta.glob("./geometrySettingModule/*.vue");

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
      displayAccuracy: 2,
    };
  },
  computed: {
    component() {
      return this.config?.type;
    },

    config() {
      return this.$store.getters["active/geometry"];
    },
  },

  methods: {
    addGroup() {
      this.config.groups.push({ start: 0, count: Infinity, materialIndex: 0 });
    },
    deleteGroup(index) {
      this.config.groups.splice(index, 1);
    },
  },
};
</script>

<style lang="less" scoped>
.geometrySettingModule-container {
  .boxSetting();
}

.geometry-groups {
  width: 100%;
}

.add-group {
  width: 100%;
  margin-bottom: @box-margin;
}

.geometry-group-item {
  width: 100%;
  .flexLayout(row, center, stretch);
  margin-bottom: @box-margin;

  .group-controller {
    width: 100%;
    .flexLayout(column);

    > .controlLayout-container:last-child {
      margin-bottom: 0;
    }
  }

  > span {
    .flexLayout(row, center, stretch);
  }
}

.group-operation {
  height: 100%;
  margin-left: @box-margin;
  padding: 0 (@box-padding / 2);
  .flexLayout(row, center, center);
  background: @error-color;
  cursor: pointer;
  .transitionSetting({background: fade(@error-color, 50) ;});
}
</style>
