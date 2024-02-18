<template>
  <div
    v-if="config.type"
    class="objectSettingModule-container"
  >
    <de-collapse-layout
      :label="transMessage.label"
      :sub-label="config.type"
      :icon="transMessage.icon"
      arrow-position="left"
    >
      <template #container>
        <de-controller-input
          v-model="config.name"
          label="名称"
        />
        <de-controller-input
          v-model="config.alias"
          label="别名"
        />
        <de-controller-code
          v-model="config.meta"
          label="数据"
        />
      </template>
    </de-collapse-layout>

    <de-collapse-layout
      label="基础设置"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-vector3
          v-model="config.position"
          label="位置"
          :step="0.1"
          :display-accuracy="displayAccuracy"
          :animation="{
            target: config,
            attribute: 'position',
          }"
        />
        <de-controller-vector3
          v-model="config.scale"
          label="缩放"
          :step="1"
          :display-accuracy="displayAccuracy"
          :animation="{
            target: config,
            attribute: 'scale',
          }"
        />
        <de-controller-vector3
          v-model="config.rotation"
          label="旋转"
          :step="1"
          :display-accuracy="displayAccuracy"
          unit="°"
          :animation="{
            target: config,
            attribute: 'rotation',
          }"
        />
        <de-controller-vector3
          v-model="config.up"
          label="朝向"
          :step="1"
          :display-accuracy="displayAccuracy"
          :animation="{
            target: config,
            attribute: 'up',
          }"
        />
        <de-controller-switch
          v-model="config.visible"
          label="可见性"
          :animation="{
            target: config,
            attribute: 'visible',
          }"
        />
        <de-controller-select
          v-model="config.lookAt"
          label="看向目标"
          :options="objectList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          :animation="{
            target: config,
            attribute: 'lookAt',
          }"
        />
      </template>
    </de-collapse-layout>

    <geometry-setting-module v-if="geometry" />
    <component-setting-module v-if="config.element" />

    <components
      :is="component"
      :config="config"
    />

    <de-collapse-layout
      label="高级设置"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-switch
          v-model="config.receiveShadow"
          label="接收阴影"
          :animation="{
            target: config,
            attribute: 'receiveShadow',
          }"
        />
        <de-controller-switch
          v-model="config.castShadow"
          label="产生阴影"
          :animation="{
            target: config,
            attribute: 'castShadow',
          }"
        />
        <de-controller-switch
          v-model="config.matrixAutoUpdate"
          label="自动更新"
          :animation="{
            target: config,
            attribute: 'matrixAutoUpdate',
          }"
        />
        <de-controller-number
          v-model="config.renderOrder"
          label="渲染顺序"
          :step="1"
          :drag-multply="1"
          :min="-Infinity"
          :max="Infinity"
          :animation="{
            target: config,
            attribute: 'renderOrder',
          }"
        />
      </template>
    </de-collapse-layout>
  </div>
</template>

<script>
import {
  CONFIGTYPE,
  MODULETYPE,
  CONFIGMODULE,
  getModule,
} from "@vis-three/middleware";

const geometrySettingModule = () => import("./geometrySettingModule.vue");
const componentSettingModule = () => import("./componentSettingModule.vue");

const components = { geometrySettingModule, componentSettingModule };

const contextList = [
  import.meta.glob("./objectSettingModule/*.vue"),
  import.meta.glob("./objectSettingModule/object/*.vue"),
  import.meta.glob("./objectSettingModule/light/*.vue"),
  import.meta.glob("./objectSettingModule/camera/*.vue"),
];

for (const context of contextList) {
  Object.keys(context).forEach((url) => {
    components[
      url
        .split("/")
        .pop()
        .replace(/.\/|\.vue$/g, "")
    ] = context[url];
  });
}

export default {
  components,
  data() {
    return {
      displayAccuracy: 2,
      transMap: {
        [MODULETYPE.MESH]: {
          label: "网格物体",
          icon: "#iconlifangti",
        },
        [MODULETYPE.LINE]: {
          label: "线条物体",
          icon: "#iconquxian",
        },
        [MODULETYPE.LINESEGMENTS]: {
          label: "线段物体",
          icon: "#iconquxian",
        },
        [MODULETYPE.CAMERA]: {
          label: "相机物体",
          icon: "#iconxiangji1",
        },
        [MODULETYPE.LIGHT]: {
          label: "光源",
          icon: "#icondengguang",
        },
        [MODULETYPE.CSS3D]: {
          label: "C3物体",
          icon: "#iconC3pingmian",
        },
        [MODULETYPE.CSS2D]: {
          label: "C2物体",
          icon: "#iconC2jingling",
        },
        [MODULETYPE.SPRITE]: {
          label: "精灵",
          icon: "#iconjingling",
        },
        [MODULETYPE.GROUP]: {
          label: "组",
          icon: "#iconzu",
        },
        [MODULETYPE.POINTS]: {
          label: "点云",
          icon: "#icondianyun",
        },
        [MODULETYPE.WATER]: {
          label: "水域",
          icon: "#iconic_shuiliu",
        },
        [MODULETYPE.PARTICLE]: {
          label: "粒子",
          icon: "#iconpitaya-YSguanli",
        },
      },
    };
  },
  computed: {
    component() {
      return this.config?.type;
    },

    config() {
      return this.$store.getters["active/object"];
    },

    geometry() {
      return this.$store.getters["active/geometry"];
    },
    transMessage() {
      return this.transMap[getModule(this.config.type)];
    },

    objectList() {
      const list = [
        {
          name: "无",
          vid: "",
        },
      ];

      const objectList = this.$store.getters.objectMapList;

      for (const map of objectList) {
        for (const config of Object.values(map)) {
          list.push({
            name: config.name,
            vid: config.vid,
          });
        }
      }
      return list;
    },
  },
};
</script>

<style lang="less" scoped></style>
