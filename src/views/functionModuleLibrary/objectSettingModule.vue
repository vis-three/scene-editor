<template>
  <div class="objectSettingModule-container" v-if="config.type">
    <de-collapse-layout
      :label="transMessage.label"
      :subLabel="config.type"
      :icon="transMessage.icon"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-input
          label="名称"
          v-model="config.name"
        ></de-controller-input>
        <de-controller-input
          label="别名"
          v-model="config.alias"
        ></de-controller-input>
        <de-controller-code
          label="数据"
          v-model="config.meta"
        ></de-controller-code>
      </template>
    </de-collapse-layout>

    <de-collapse-layout
      label="基础设置"
      icon="#iconshezhi"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-vector3
          label="位置"
          :step="0.1"
          :displayAccuracy="displayAccuracy"
          v-model="config.position"
          :animation="{
            target: config,
            attribute: 'position',
          }"
        ></de-controller-vector3>
        <de-controller-vector3
          label="缩放"
          :step="1"
          :displayAccuracy="displayAccuracy"
          v-model="config.scale"
          :animation="{
            target: config,
            attribute: 'scale',
          }"
        ></de-controller-vector3>
        <de-controller-vector3
          label="旋转"
          :step="1"
          :displayAccuracy="displayAccuracy"
          unit="°"
          v-model="config.rotation"
          :animation="{
            target: config,
            attribute: 'rotation',
          }"
        ></de-controller-vector3>
        <de-controller-vector3
          label="朝向"
          :step="1"
          :displayAccuracy="displayAccuracy"
          v-model="config.up"
          :animation="{
            target: config,
            attribute: 'up',
          }"
        ></de-controller-vector3>
        <de-controller-switch
          label="可见性"
          v-model="config.visible"
          :animation="{
            target: config,
            attribute: 'visible',
          }"
        ></de-controller-switch>
        <de-controller-select
          label="看向目标"
          :options="objectList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.lookAt"
          :animation="{
            target: config,
            attribute: 'lookAt',
          }"
        ></de-controller-select>
      </template>
    </de-collapse-layout>

    <geometry-setting-module v-if="geometry"></geometry-setting-module>
    <component-setting-module v-if="config.element"></component-setting-module>

    <components :config="config" :is="component"></components>

    <de-collapse-layout
      label="高级设置"
      icon="#iconshezhi"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-switch
          label="接收阴影"
          v-model="config.receiveShadow"
          :animation="{
            target: config,
            attribute: 'receiveShadow',
          }"
        ></de-controller-switch>
        <de-controller-switch
          label="产生阴影"
          v-model="config.castShadow"
          :animation="{
            target: config,
            attribute: 'castShadow',
          }"
        ></de-controller-switch>
        <de-controller-switch
          label="自动更新"
          v-model="config.matrixAutoUpdate"
          :animation="{
            target: config,
            attribute: 'matrixAutoUpdate',
          }"
        ></de-controller-switch>
        <de-controller-number
          label="渲染顺序"
          :step="1"
          :dragMultply="1"
          :min="-Infinity"
          :max="Infinity"
          v-model="config.renderOrder"
          :animation="{
            target: config,
            attribute: 'renderOrder',
          }"
        ></de-controller-number>
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

const components = { geometrySettingModule };

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
