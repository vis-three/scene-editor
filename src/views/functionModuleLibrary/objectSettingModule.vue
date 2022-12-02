<template>
  <div class="objectSettingModule-container" v-if="config.type">
    <de-collapse-layout
      :label="transMessage.label"
      :icon="transMessage.icon"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-input
          label="名称"
          v-model="config.name"
        ></de-controller-input>
        <de-controller-input
          label="类型"
          v-model="config.type"
          disabled
        ></de-controller-input>
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
import { CONFIGTYPE, MODULETYPE, CONFIGMODULE, getModule } from "vis-three";
const geometrySettingModule = () => import("./geometrySettingModule.vue");
const componentSettingModule = () => import("./componentSettingModule.vue");

const Mesh = () => import("./objectSettingModule/Mesh.vue");

const PointLight = () => import("./objectSettingModule/light/PointLight");
const DirectionalLight = () =>
  import("./objectSettingModule/light/DirectionalLight");
const SpotLight = () => import("./objectSettingModule/light/SpotLight");
const AmbientLight = () =>
  import("./objectSettingModule/light/AmbientLight.vue");

const PerspectiveCamera = () =>
  import("./objectSettingModule/camera/PerspectiveCamera");

const CSS3DPlane = () => import("./objectSettingModule/CSS3DPlane.vue");
const CSS3DSprite = () => import("./objectSettingModule/CSS3DSprite.vue");
const CSS2DPlane = () => import("./objectSettingModule/CSS2DPlane.vue");

const Sprite = () => import("./objectSettingModule/Sprite.vue");
const Group = () => import("./objectSettingModule/Group.vue");

export default {
  components: {
    geometrySettingModule,
    componentSettingModule,

    Mesh,
    CSS3DPlane,
    CSS3DSprite,
    CSS2DPlane,
    Sprite,
    Group,

    PointLight,
    DirectionalLight,
    SpotLight,
    AmbientLight,

    PerspectiveCamera,
  },
  data() {
    return {
      displayAccuracy: 2,
      transMap: {
        [MODULETYPE.MESH]: {
          label: "网格物体",
          icon: "#iconjihetuxing",
        },
        [MODULETYPE.LINE]: {
          label: "线条物体",
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
          icon: "#iconchuangkou",
        },
        [MODULETYPE.CSS2D]: {
          label: "C2物体",
          icon: "#iconchuangkou",
        },
        [MODULETYPE.SPRITE]: {
          label: "精灵",
          icon: "#iconchuangkou",
        },
        [MODULETYPE.GROUP]: {
          label: "组",
          icon: "#iconchuangkou",
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

      const objectList = [
        this.$store.getters["mesh/get"],
        this.$store.getters["camera/get"],
        this.$store.getters["sprite/get"],
        this.$store.getters["group/get"],
        this.$store.getters["css3D/get"],
      ];

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
