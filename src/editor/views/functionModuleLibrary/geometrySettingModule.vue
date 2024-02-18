<template>
  <div
    v-if="config"
    class="geometrySettingModule-container"
  >
    <de-collapse-layout
      label="几何基础"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-input
          v-model="config.name"
          label="几何名称"
        />
        <de-controller-vector3
          v-model="config.position"
          :keyframe="false"
          label="锚点位置"
          :step="0.1"
          :display-accuracy="displayAccuracy"
        />
        <de-controller-vector3
          v-model="config.scale"
          :keyframe="false"
          label="锚点缩放"
          :step="1"
          :display-accuracy="displayAccuracy"
        />
        <de-controller-vector3
          v-model="config.rotation"
          :keyframe="false"
          label="锚点旋转"
          :step="1"
          :display-accuracy="displayAccuracy"
          unit="°"
        />
        <de-controller-switch
          v-model="config.center"
          :keyframe="false"
          label="居中"
        />

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
            v-for="(item, index) in config.groups"
            :key="index"
            class="geometry-group-item"
          >
            <div class="group-controller">
              <de-controller-number
                v-model="item.start"
                :keyframe="false"
                label="起始顶点"
                :step="1"
                :min="0"
              />
              <de-controller-number
                v-model="item.count"
                :keyframe="false"
                label="结束顶点"
                :step="1"
                :min="Infinity"
              />
              <de-controller-number
                v-model="item.materialIndex"
                :keyframe="false"
                label="材质索引"
                :step="1"
                :min="0"
              />
            </div>

            <el-popconfirm
              title="确定删除当下几何组吗？"
              @confirm="deleteGroup(index)"
            >
              <div
                slot="reference"
                class="group-operation"
              >
                <i class="el-icon-delete" />
              </div>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </de-collapse-layout>

    <component
      :is="component"
      :config="config"
    />
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
