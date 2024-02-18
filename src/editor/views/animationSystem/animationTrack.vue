<template>
  <div
    ref="animationTrack"
    class="animationTrack-container"
  >
    <div
      v-for="(item, index) in animationMap"
      :key="index"
      class="animationTrack-item-box"
    >
      <div
        class="animationTrack-objectTrack"
        :style="{
          backgroundColor: item.trackColor,
          width: `${(item.duration / totalDuration) * 100}%`,
        }"
      />

      <div
        v-for="(tracksItem, tracksIndex) in animationTrack[index].load"
        v-show="item.open"
        :key="tracksIndex"
        class="animationTrack-attributeTrack"
      >
        <div
          v-if="actionMap[tracksItem]"
          class="attributeTrack-load"
        >
          <de-controller-switch
            v-model="actionMap[tracksItem].enabled"
            :keyframe="false"
            label="使用"
          />
          <de-controller-number
            v-model="actionMap[tracksItem].weight"
            :keyframe="false"
            label="权重"
            :step="0.1"
            :drag-multply="2"
            :min="0"
          />
          <de-controller-number
            v-model="actionMap[tracksItem].timeScale"
            :keyframe="false"
            label="时间缩放"
            :step="0.1"
            :drag-multply="2"
            :min="0"
          />
        </div>
      </div>

      <div
        v-for="(tracksItem, tracksIndex) in animationTrack[index].script"
        v-show="item.open"
        :key="tracksIndex"
        class="animationTrack-attributeTrack"
      >
        <div class="attributeTrack-script">
          <component
            :is="item.component"
            v-for="item in getControllers(tracksItem.script.name)"
            :key="item.key"
            v-model="getConfigure(tracksItem.script.vid).script[item.key]"
            :keyframe="false"
            :label="item.label"
            v-bind="item.props"
          />
        </div>
      </div>

      <div
        v-for="(tracksItem, tracksIndex) in animationTrack[index].keyframe"
        v-show="item.open"
        :key="tracksIndex"
        class="animationTrack-attributeTrack"
      >
        <div
          v-for="(keyframeItem, keyframeIndex) in tracksItem.keyframe"
          :key="keyframeIndex"
          class="attributeTrack-keyframe"
          :class="{ active: currentFrame === keyframeIndex * 1 }"
          :style="{
            left: `${(keyframeIndex / totalFrame) * 100}%`,
          }"
          @click="
            () => {
              $store.commit('animation/currentFrame', Number(keyframeIndex));
            }
          "
        >
          <vis-icon code="#iconlingxing" />
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
  watch: {
    scrollTop(newValue, oldValue) {
      this.$refs.animationTrack.scrollTop = newValue;
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
