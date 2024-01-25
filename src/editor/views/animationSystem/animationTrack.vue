<template>
  <div class="animationTrack-container" ref="animationTrack">
    <div
      class="animationTrack-item-box"
      v-for="(item, index) in animationMap"
      :key="index"
    >
      <div
        class="animationTrack-objectTrack"
        :style="{
          backgroundColor: item.trackColor,
          width: `${(item.duration / totalDuration) * 100}%`,
        }"
      ></div>

      <div
        class="animationTrack-attributeTrack"
        v-show="item.open"
        v-for="(tracksItem, tracksIndex) in animationTrack[index].load"
        :key="tracksIndex"
      >
        <div class="attributeTrack-load" v-if="actionMap[tracksItem]">
          <de-controller-switch
            :keyframe="false"
            label="使用"
            v-model="actionMap[tracksItem].enabled"
          ></de-controller-switch>
          <de-controller-number
            :keyframe="false"
            label="权重"
            :step="0.1"
            :dragMultply="2"
            :min="0"
            v-model="actionMap[tracksItem].weight"
          ></de-controller-number>
          <de-controller-number
            :keyframe="false"
            label="时间缩放"
            :step="0.1"
            :dragMultply="2"
            :min="0"
            v-model="actionMap[tracksItem].timeScale"
          ></de-controller-number>
        </div>
      </div>

      <div
        class="animationTrack-attributeTrack"
        v-show="item.open"
        v-for="(tracksItem, tracksIndex) in animationTrack[index].script"
        :key="tracksIndex"
      >
        <div class="attributeTrack-script">
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

      <div
        class="animationTrack-attributeTrack"
        v-show="item.open"
        v-for="(tracksItem, tracksIndex) in animationTrack[index].keyframe"
        :key="tracksIndex"
      >
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
      </div>
    </div>
  </div>
</template>

<script>
import aniScriptLibrary from "@/editor/assets/js/aniScriptLibrary";
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
      return this.$store.getters["animation/editorMap"];
    },
    actionMap() {
      return this.$store.getters["animationAction/get"];
    },
    animationTrack() {
      return this.$store.getters["animationTrack/get"];
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
      return name ? aniScriptLibrary[name].controllers : [];
    },
    getConfigure(vid) {
      return engine.getConfigBySymbol(vid);
    },
    getAnimationAction(vid) {
      return this.actionMap[vid];
    },
  },
  watch: {
    scrollTop(newValue, oldValue) {
      this.$refs.animationTrack.scrollTop = newValue;
    },
  },
};
</script>

<style lang="less" scoped>
.animationTrack-container {
  .boxSetting(100%, calc(100% - 40px));
  overflow: hidden;
  > .animationTrack-item-box {
    margin-bottom: 1px;
    > .animationTrack-objectTrack {
      .boxSetting(100%, 20px);
      background: pink;
    }
    .animationTrack-attributeTrack {
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

.attributeTrack-load,
.attributeTrack-script {
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
