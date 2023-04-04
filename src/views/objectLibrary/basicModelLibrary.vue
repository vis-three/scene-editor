<template>
  <div class="basicElement-container">
    <object-collapse
      v-for="(item, index) in list"
      :key="index"
      :dataList="item.list"
      :clickHanlder="item.click"
      :icon="item.icon"
      :label="item.label"
    ></object-collapse>
  </div>
</template>

<script>
import {
  CONFIGMODULE,
  CONFIGTYPE,
  generateConfig,
} from "@vis-three/middleware";
import objectCollapse from "@/templates/objectCollapse.vue";
import { engine, history } from "@/assets/js/VisFrame";
import Vue from "vue";

import { AddMeshAction } from "@/assets/js/action/AddMeshAction";
import { AddLineAction } from "@/assets/js/action/AddLineAction";
import { AddCSS3DAction } from "@/assets/js/action/AddCSS3DAction";
import { AddObjectAction } from "@/assets/js/action/AddObjectAction";

export default {
  components: {
    objectCollapse,
  },
  data() {
    return {
      list: [
        {
          icon: "#iconpingmianjihe",
          label: "参数网格",
          list: [
            {
              icon: "#iconpingmianjihe",
              label: "立方体",
              geometry: CONFIGTYPE.BOXGEOMETRY,
            },
            {
              icon: "#iconpingmianjihe",
              label: "球体",
              geometry: CONFIGTYPE.SPHEREGEOMETRY,
            },
            {
              icon: "#iconpingmianjihe",
              label: "锥体",
              geometry: CONFIGTYPE.CONEGEOMETRY,
            },
            {
              icon: "#iconpingmianjihe",
              label: "柱体",
              geometry: CONFIGTYPE.CYLINDERGEOMETRY,
            },
            {
              icon: "#iconpingmianjihe",
              label: "环体",
              geometry: CONFIGTYPE.TORUSGEOMETRY,
            },
          ],
          click: function (item) {
            const geometryConfig = generateConfig(item.geometry);
            const meshConfig = generateConfig(CONFIGTYPE.MESH);

            // meshConfig.icon = item.icon;
            meshConfig.name = `${item.label}${meshConfig.vid.slice(-2)}`;
            meshConfig.geometry = geometryConfig.vid;

            history.apply(
              new AddMeshAction({
                geometryConfig,
                meshConfig,
                store: this.$store,
                engine: VIS.engine,
              }),
              true
            );
          },
        },
        {
          icon: "#iconpingmianjihe",
          label: "参数平面",
          list: [
            {
              icon: "#iconpingmianjihe",
              label: "矩形",
              geometry: CONFIGTYPE.PLANEGEOMETRY,
            },
            {
              icon: "#iconpingmianjihe",
              label: "圆形",
              geometry: CONFIGTYPE.CIRCLEGEOMETRY,
            },
            {
              icon: "#iconpingmianjihe",
              label: "圆环",
              geometry: CONFIGTYPE.RINGGEOMETRY,
            },
          ],
          click: function (item) {
            const geometryConfig = generateConfig(item.geometry);
            const meshConfig = generateConfig(CONFIGTYPE.MESH);

            // meshConfig.icon = item.icon;
            meshConfig.name = `${item.label}${meshConfig.vid.slice(-2)}`;
            meshConfig.geometry = geometryConfig.vid;

            history.apply(
              new AddMeshAction({
                geometryConfig,
                meshConfig,
                store: this.$store,
                engine: VIS.engine,
              }),
              true
            );
          },
        },
        {
          icon: "#iconpingmianjihe",
          label: "形状",
          list: [
            {
              icon: "#iconpingmianjihe",
              label: "折线形状",
              geometry: CONFIGTYPE.LINESHAPEGEOMETRY,
            },
          ],
          click: function (item) {
            const geometryConfig = generateConfig(item.geometry, {
              path: [
                { x: 0, y: 0 },
                { x: 10, y: 0 },
                { x: 0, y: 10 },
              ],
            });
            const meshConfig = generateConfig(CONFIGTYPE.MESH);

            meshConfig.name = `${item.label}${meshConfig.vid.slice(-2)}`;
            meshConfig.geometry = geometryConfig.vid;

            history.apply(
              new AddMeshAction({
                geometryConfig,
                meshConfig,
                store: this.$store,
                engine: VIS.engine,
              }),
              true
            );
          },
        },
        {
          icon: "#iconpingmianjihe",
          label: "管道",
          list: [
            {
              icon: "#iconpingmianjihe",
              label: "折线管道",
              geometry: CONFIGTYPE.LINETUBEGEOMETRY,
            },
            {
              icon: "#iconpingmianjihe",
              label: "曲线管道",
              geometry: CONFIGTYPE.SPLINETUBEGEOMETRY,
            },
          ],
          click: function (item) {
            const geometry = generateConfig(item.geometry, {
              path: [
                { x: -10, y: 10, z: 0 },
                { x: 0, y: 10, z: 10 },
                { x: 0, y: 0, z: -10 },
                { x: 10, y: 0, z: 0 },
              ],
            });
            geometry.name = `${item.label}几何-${geometry.vid.slice(-2)}`;

            const mesh = generateConfig(CONFIGTYPE.MESH, {
              geometry: geometry.vid,
            });
            mesh.name = `${item.label}-${mesh.vid.slice(-2)}`;

            history.apply(
              new AddMeshAction({
                geometryConfig: geometry,
                meshConfig: mesh,
                store: this.$store,
                engine,
              }),
              true
            );
          },
        },
        {
          icon: "#iconpingmianjihe",
          label: "线条",
          list: [
            {
              icon: "#iconpingmianjihe",
              label: "折线",
              geometry: CONFIGTYPE.LINECURVEGEOMETRY,
            },
            {
              icon: "#iconpingmianjihe",
              label: "曲线",
              geometry: CONFIGTYPE.SPLINECURVEGEOMETRY,
            },
            {
              icon: "#iconpingmianjihe",
              label: "二次贝塞尔",
              geometry: CONFIGTYPE.CUBICBEZIERCURVEGEOMETRY,
            },
            {
              icon: "#iconpingmianjihe",
              label: "三次贝塞尔",
              geometry: CONFIGTYPE.QUADRATICBEZIERCURVEGEOMETRY,
            },
          ],
          click: function (item) {
            const geometry = generateConfig(item.geometry, {
              path: [
                { x: -10, y: 10, z: 0 },
                { x: 0, y: 10, z: 10 },
                { x: 0, y: 0, z: -10 },
                { x: 10, y: 0, z: 0 },
              ],
            });
            geometry.name = `${item.label}几何-${geometry.vid.slice(-2)}`;
            const line = generateConfig(CONFIGTYPE.LINE, {
              geometry: geometry.vid,
            });
            line.name = `${item.label}-${line.vid.slice(-2)}`;

            history.apply(
              new AddLineAction({
                engine,
                store: this.$store,
                geometry,
                line,
              }),
              true
            );
          },
        },
        {
          icon: "#iconpingmianjihe",
          label: "DOM",
          list: [
            {
              icon: "#iconpingmianjihe",
              label: "3D平面",
              type: CONFIGTYPE.CSS3DPLANE,
            },
            {
              icon: "#iconpingmianjihe",
              label: "3D精灵",
              type: CONFIGTYPE.CSS3DSPRITE,
            },
            {
              icon: "#iconpingmianjihe",
              label: "2D精灵",
              type: CONFIGTYPE.CSS2DPLANE,
            },
          ],
          click: function (item) {
            const config = generateConfig(item.type, {
              width: 100,
              height: 100,
            });
            config.name = `${item.label}-${config.vid.slice(-2)}`;

            history.apply(
              new AddCSS3DAction({
                engine,
                store: this.$store,
                config,
              }),
              true
            );
          },
        },
        {
          icon: "#iconpingmianjihe",
          label: "DOM",
          list: [
            {
              icon: "#iconpingmianjihe",
              label: "组",
              type: CONFIGTYPE.GROUP,
            },
            {
              icon: "#iconpingmianjihe",
              label: "空对象",
              type: CONFIGTYPE.OBJECT3D,
            },
          ],
          click: function (item) {
            const config = generateConfig(item.type);
            config.name = `${item.label}-${config.vid.slice(-2)}`;

            history.apply(
              new AddObjectAction({
                engine,
                store: this.$store,
                config,
                module: CONFIGMODULE[item.type],
              }),
              true
            );
          },
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.basicElement-container {
  .boxSetting(100%, 70vh);
  overflow: auto;
}
</style>
