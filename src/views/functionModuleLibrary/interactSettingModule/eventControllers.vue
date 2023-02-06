<template>
  <div class="eventControllers-container">
    <de-collapse-layout :label="controllerConfigure.label" :showIcon="false">
      <component
        :keyframe="false"
        slot="container"
        v-for="(item, index) in controllerConfigure.params"
        :key="index"
        :is="item.component"
        :label="item.label"
        v-model="eventConfigure.params[item.key]"
        v-bind="item.props"
      ></component>
    </de-collapse-layout>
    <div class="operation-box" @click="deleteEvent(eventConfigure)">
      <i class="el-icon-delete"></i>
    </div>

    <span style="display: none">{{ JSON.stringify(objects) }}</span>
    <span style="display: none">{{ JSON.stringify(objects) }}</span>
  </div>
</template>

<script>
import { controllers } from "@/assets/js/eventLibrary";
import { Easing } from "@tweenjs/tween.js";

export default {
  props: {
    eventConfigure: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    controllerConfigure() {
      const config = JSON.parse(
        JSON.stringify(controllers[this.eventConfigure.name])
      );
      config.params.forEach((item) => {
        if (item.props && item.props.options && this[item.props.options]) {
          item.props.options = this[item.props.options];
        }
      });
      return config;
    },

    objects() {
      const objectList = [
        this.$store.getters["mesh/get"],
        this.$store.getters["camera/get"],
        this.$store.getters["sprite/get"],
        this.$store.getters["group/get"],
        this.$store.getters["css3D/get"],
      ];

      const list = [];

      for (const map of objectList) {
        for (const config of Object.values(map)) {
          list.push({
            label: config.name,
            value: config.vid,
          });
        }
      }
      return list;
    },

    materials() {
      console.log(1);
      return Object.values(this.$store.getters["material/get"]).map((elem) => {
        return {
          label: elem.name,
          value: elem.vid,
        };
      });
    },

    scenes() {
      return Object.values(this.$store.getters["scene/get"]).map((elem) => {
        return {
          label: elem.name,
          value: elem.vid,
        };
      });
    },

    cameras() {
      return Object.values(this.$store.getters["camera/get"]).map((elem) => {
        return {
          label: elem.name,
          value: elem.vid,
        };
      });
    },

    animations() {
      return Object.values(this.$store.getters["animation/get"]).map((elem) => {
        return {
          label: elem.vid,
          value: elem.vid,
        };
      });
    },
    timingFunction() {
      return [
        { label: "线性运动", value: Easing.Linear.None },
        { label: "二次缓进缓出", value: Easing.Quartic.InOut },
      ];
    },
  },

  methods: {
    deleteEvent(eventConfigure) {
      this.$emit("deleteEvent", eventConfigure);
    },
  },

  created() {},
};
</script>

<style lang="less" scoped>
.eventControllers-container {
  .flexLayout(row, space-between, stretch);
  // background-color: @darkerTheme-backgroundColor;
  /deep/ .collapseLayout-container {
    margin-bottom: 0;
    background-color: unset;
    .collapseLayout-title {
      height: unset;
    }
  }

  .operation-box {
    margin: @box-margin 0;
    padding: @box-padding / 2;
    background-color: @error-color;
    cursor: pointer;
    .flexLayout(row, center, center);
    .transitionSetting({background-color: fade(@error-color, 50) ;});
  }
}
</style>
