<template>
  <div class="eventControllers-container">
    <de-collapse-layout
      :label="controllerConfigure.label"
      :show-icon="false"
    >
      <component
        :is="item.component"
        v-for="(item, index) in controllerConfigure.params"
        slot="container"
        :key="index"
        v-model="eventConfigure.params[item.key]"
        :keyframe="false"
        :label="item.label"
        v-bind="item.props"
      />
    </de-collapse-layout>
    <div
      class="operation-box"
      @click="deleteEvent(eventConfigure)"
    >
      <i class="el-icon-delete" />
    </div>
  </div>
</template>

<script>
import { controllers } from "@/editor/assets/js/eventLibrary";
import { Easing } from "@tweenjs/tween.js";
import { OBJECTMODULE } from "@vis-three/middleware";
import { TIMINGFUNCTION } from "@vis-three/library-event";

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
      const objectList = Object.keys(OBJECTMODULE).map(
        (module) => this.$store.getters[`${module}/get`]
      );

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
          label: elem.name,
          value: elem.vid,
        };
      });
    },

    animationActions() {
      return Object.values(this.$store.getters["animationAction/get"]).map(
        (elem) => {
          return {
            label: elem.name,
            value: elem.vid,
          };
        }
      );
    },

    timingFunction() {
      return [
        { label: "线性运动", value: TIMINGFUNCTION.EASING_LINEAR_NONE },
        { label: "二次缓进缓出", value: TIMINGFUNCTION.EASING_QUADRATIC_INOUT },
      ];
    },
  },

  created() {},

  methods: {
    deleteEvent(eventConfigure) {
      this.$emit("deleteEvent", eventConfigure);
    },
  },
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
    padding: (@box-padding / 2);
    background-color: @error-color;
    cursor: pointer;
    .flexLayout(row, center, center);
    .transitionSetting({background-color: fade(@error-color, 50) ;});
  }
}
</style>
