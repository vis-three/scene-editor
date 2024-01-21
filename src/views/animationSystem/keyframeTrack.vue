<template>
  <div class="keyframeTrack-container" ref="keyframeTrack">
    <div
      class="keyframeTrack-item-box"
      v-for="(item, index) in animationMap"
      :key="index"
    >
      <div
        class="keyframeTrack-objectTrack"
        :style="{
          backgroundColor: item.trackColor,
          width: `${(item.duration / totalDuration) * 100}%`,
        }"
      ></div>
      <div
        class="keyframeTrack-attributeTrack"
        v-show="item.open"
        v-for="(tracksItem, tracksIndex) in keyframeTrack[index]"
        :key="tracksIndex"
      >
        <template v-if="!tracksItem.script.name">
          <div
            class="attributeTrack-keyframe"
            :class="{ active: currentFrame === keyframeIndex * 1 }"
            v-for="(keyframeItem, keyframeIndex) in tracksItem.keyframe"
            :key="keyframeIndex"
            :style="{
              left: `${(keyframeIndex / totalFrame) * 100}%`,
            }"
            @click="
              () => {
                $store.commit('animation/currentFrame', Number(keyframeIndex));
              }
            "
          >
            <vis-icon code="#iconlingxing"></vis-icon>
          </div>
        </template>

        <div v-else class="attributeTrack-keyframe-script">
          <component
            :keyframe="false"
            v-for="item in getControllers(tracksItem.script.name)"
            :key="item.key"
            :is="item.component"
            :label="item.label"
            v-model="getConfigure(tracksItem.script.vid).script[item.key]"
            v-bind="item.props"
          ></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import aniScriptLibrary from "@/assets/js/aniScriptLibrary";
import { engine } from "../../assets/js/vis";

export default {
  props: {
    scrollTop: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  computed: {
    animationMap() {
      return this.$store.getters["animation/map"];
    },
    keyframeTrack() {
      return this.$store.getters["keyframeTrack/get"];
    },
    totalDuration() {
      return this.$store.getters["animation/totalDuration"];
    },
    totalFrame() {
      return this.$store.getters["animation/totalFrame"];
    },
    currentFrame() {
      return this.$store.getters["animation/currentFrame"];
    },
  },
  methods: {
    getControllers(name) {
      return aniScriptLibrary[name].controllers;
    },
    getConfigure(vid) {
      return engine.getConfigBySymbol(vid);
    },
  },
  watch: {
    scrollTop(newValue, oldValue) {
      this.$refs.keyframeTrack.scrollTop = newValue;
    },
  },
};
</script>

<style lang="less" scoped>
.keyframeTrack-container {
  .boxSetting(100%, calc(100% - 40px));
  overflow: hidden;
  > .keyframeTrack-item-box {
    margin-bottom: 1px;
    > .keyframeTrack-objectTrack {
      .boxSetting(100%, 20px);
      background: pink;
    }
    .keyframeTrack-attributeTrack {
      .boxSetting(100%, 20px);
      border-bottom: 1px solid @brighterTheme-backgroundColor;
      position: relative;
      .attributeTrack-keyframe {
        .boxSetting(0, 100%);
        .flexLayout(row, center, center);
        .absolutePosition();
        cursor: pointer;
        .transitionSetting({
          color: @themeHover-color;
        });
      }
      .active {
        color: @theme-color;
      }
    }
  }
}

.attributeTrack-keyframe-script {
  height: 100%;
  overflow: hidden;
  .flexLayout();
  .controlLayout-container {
    margin-bottom: unset;
    width: 200px;
    margin: 0 @box-margin;
  }
}
</style>
