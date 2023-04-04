<template>
  <div class="operationController-container">
    <div class="operationGeneral-container">
      <div class="operationGeneral-search">
        <el-input
          size="mini"
          placeholder="搜索"
          prefix-icon="el-icon-search"
          v-model="searchValue"
        ></el-input>
      </div>
      <div class="operationGeneral-time">
        <span>{{ clipCurrentTime + "/" + totalTime }}</span>
      </div>
      <div class="operationGeneral-control">
        <vis-icon
          code="#iconkuaijin"
          style="transform: rotate(180deg)"
          @click.native="
            () => {
              $store.commit('animation/lastFrame');
            }
          "
        ></vis-icon>
        <vis-icon
          title="播放"
          @click.native="togglePlay"
          :code="play ? '#iconzantingtingzhi' : '#iconbofang'"
        ></vis-icon>
        <vis-icon
          code="#iconkuaijin"
          @click.native="
            () => {
              $store.commit('animation/nextFrame');
            }
          "
        ></vis-icon>
      </div>
    </div>
    <div class="operationMain-container">
      <!-- 标题栏 STR -->
      <div class="operationMain-title-box">
        <div class="operation-helper">
          <vis-icon code="#iconkejian" title="可见"></vis-icon>
          <vis-icon code="#iconlock" title="操作"></vis-icon>
          <vis-icon code="#iconyuanxing" title="独奏"></vis-icon>
          <vis-icon code="#iconshengyin" title="声音"></vis-icon>
        </div>
        <div class="operation-name">
          <vis-icon code="#iconbiaoqian"></vis-icon>
          <span>名称</span>
        </div>
      </div>
      <!-- 标题栏 END -->
      <!-- 选项栏 STR -->
      <div class="operationMain-item-box" @scroll="scroll" ref="item-box">
        <div
          class="operationMain-item"
          v-for="(item, index) in animationMap"
          :key="index"
          :class="{ 'operationMain-item-chouse': item.chouse }"
          @click="chouseObject(item)"
        >
          <div class="item-rootObject">
            <div class="item-helper">
              <div class="item-helper-checkBox">
                <vis-icon
                  code="#iconkejian"
                  title="可见"
                  v-show="item.visible"
                ></vis-icon>
              </div>
              <div class="item-helper-checkBox">
                <vis-icon
                  code="#iconlock"
                  title="操作"
                  v-show="item.lock"
                ></vis-icon>
              </div>
              <div class="item-helper-checkBox">
                <vis-icon
                  code="#iconyuanxing"
                  title="独奏"
                  v-show="item.solo"
                ></vis-icon>
              </div>
              <div class="item-helper-checkBox">
                <vis-icon
                  code="#iconshengyin"
                  title="声音"
                  v-show="item.voice"
                ></vis-icon>
              </div>
            </div>
            <div class="item-open-sign" @click="triggleItem(item)">
              <vis-icon
                :class="{ 'sign-active': item.open }"
                style="transform: scale(0.7)"
                code="#iconsanjiaojiantouyou"
              ></vis-icon>
            </div>
            <div class="item-name">
              <span v-text="getObjectName(index)"></span>
            </div>
          </div>
          <div
            class="item-track"
            v-show="item.open"
            v-for="(trackItem, trackIndex) in keyframeTrack[index]"
            :key="trackIndex"
          >
            <span class="track-title" v-text="trackItem.name"></span>
            <el-select
              v-model="trackItem.script.name"
              placeholder="选择脚本"
              size="mini"
              @change="
                change({
                  vid: index,
                  attribute: trackIndex,
                  scirpt: trackItem.script.name,
                  item: trackItem,
                })
              "
            >
              <el-option
                v-for="item in aniScriptOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <!-- 选项栏 END -->
    </div>
  </div>
</template>

<script>
import {
  CONFIGTYPE,
  generateConfig,
  AniScriptGeneratorManager,
} from "@vis-three/middleware";
import { engine } from "../../assets/js/VisFrame";
import aniScrpit from "@/assets/js/aniScriptLibrary";
import Vue from "vue";

export default {
  data() {
    return {
      searchValue: "",
      clipCurrentTime: "00:00:00",
      aniScriptOptions: [],
    };
  },
  computed: {
    animationMap() {
      return this.$store.getters["animation/map"];
    },
    keyframeTrack() {
      return this.$store.getters["keyframeTrack/get"];
    },
    totalTime() {
      const totalDuration = this.$store.getters["animation/totalDuration"];
      let time = "";
      if (totalDuration >= 60) {
        const min = Math.floor(totalDuration / 60);
        time += min >= 10 ? min : `0${min}`;

        time += ":";

        const sec = totalDuration - min * 60;
        time += sec >= 10 ? sec : `0${sec}`;

        time += ":00";
      } else {
        time = `00:${totalDuration}:00`;
      }
      return time;
    },
    play() {
      return this.$store.getters["animation/play"];
    },
  },
  methods: {
    triggleItem(item) {
      item.open = !item.open;
    },
    togglePlay() {
      this.$store.commit("animation/play", !this.play);
    },
    scroll($event) {
      this.$emit("scrollHandler", $event.target.scrollTop);
    },
    getObjectName(vid) {
      return engine.getConfigBySymbol(vid).name;
    },
    chouseObject() {},
    change({ vid, attribute, scirpt, item }) {
      if (item.script.name) {
        const config = Vue.observable(
          generateConfig(CONFIGTYPE.SCRIPTANIMATION, {
            target: vid,
            attribute: `.${attribute}`,
            script: AniScriptGeneratorManager.generateConfig(scirpt),
          })
        );

        engine.applyConfig(config);

        item.script.vid = config.vid;
      }
    },
  },
  created() {
    this.aniScriptOptions = Object.values(aniScrpit).map((elem) => ({
      label: elem.desp,
      value: elem.name,
    }));
    this.aniScriptOptions.unshift({
      label: "选择脚本",
      value: "",
    });
  },
};
</script>

<style lang="less" scoped>
.operationController-container {
  border-right: 2px solid @darkestTheme-backgroundColor;
  .boxSetting();
  > .operationGeneral-container {
    .boxSetting(100%, 30px);
    margin-bottom: 2px;
    background: @theme-backgroundColor;
    .flexLayout(row, space-between, center);
    padding: 0 @box-padding;
    > .operationGeneral-search {
      /deep/ .el-input--mini {
        > input {
          border-radius: 10px;
          background: @disabledText-color;
          border: 0;
          color: @text-color;
          .transitionSetting();
          &:focus {
            background-color: white;
            color: #4d4d4d;
          }
        }
        .el-input__icon {
          line-height: 20px;
        }
      }
    }
    > .operationGeneral-time {
      margin-left: @box-margin;
      // font-size: @bigTitle-fontSize;
      font-weight: bold;
      > span {
        display: inline-block;
        text-align: center;
      }
    }
    > .operationGeneral-control {
      margin-left: @box-margin;
      display: flex;
      flex-wrap: nowrap;
      > .icon-container {
        margin: 0 2.5px;
        color: @text-color;
        font-size: @title-fontSize;
        cursor: pointer;
        .transitionSetting({
          color: @themeHover-color;
        });
      }
    }
  }
  > .operationMain-container {
    .boxSetting(100%, calc(~"100% - 32px"));
    background: @darkerTheme-backgroundColor;
    > .operationMain-title-box {
      .flexLayout();
      .boxSetting(100%, 18px);
      background-color: @theme-backgroundColor;
      padding: 0 @box-padding;
      margin-bottom: 1px;
      > div {
        border-right: 1px solid @darkestTheme-backgroundColor;
        height: 100%;
        .flexLayout(row, flex-start, center);
        padding: 0 5px;
      }
      > div:first-child {
        padding-left: 0;
      }
      > div:last-child {
        border-right: 0;
      }
      > .operation-helper {
        > .icon-container {
          margin: 0 (@box-margin / 2);
        }
        > .icon-container:first-child {
          margin-left: 0;
        }
      }
      > .operation-name {
        flex: 1;
      }
      > .operation-father {
        flex: 1;
      }
    }
    > .operationMain-item-box {
      .boxSetting(100%, calc(100% - 18px - 1px - @box-padding * 2));
      overflow: auto;
      > .operationMain-item {
        margin-bottom: 1px;
        cursor: pointer;
        > .item-rootObject {
          .boxSetting(100%, 20px);
          background-color: @brighterTheme-backgroundColor;
          padding: 0 @box-padding;
          .flexLayout(row, flex-start, center);
          .transitionSetting({
            background-color: @themeDarkHover-color;
          });
          > .item-helper {
            padding-right: (@box-padding / 2);
            .flexLayout(row, center, center);
            border-right: 1px solid @darkestTheme-backgroundColor;
            > .item-helper-checkBox {
              .boxSetting(14px, 14px);
              .flexLayout(row, center, center);
              background: @darkestTheme-backgroundColor;
              margin: 0 (@box-margin / 2);
              cursor: pointer;
              > .icon-container {
                font-size: 12px;
              }
            }
            > .item-helper-checkBox:first-child {
              margin-left: 0;
            }
          }
          > .item-open-sign {
            padding-left: (@box-padding / 2);
            .transitionSetting();
            .sign-active {
              transform: rotate(90deg) scale(0.7) !important;
            }
          }

          > .item-name {
            cursor: default;
            padding-left: (@box-padding / 2);
            > span {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        > .item-track {
          height: 20px;
          padding: 0 @box-padding;
          border-bottom: 1px solid @brighterTheme-backgroundColor;
          background: @darkestTheme-backgroundColor;
          .flexLayout();
          > .track-title {
            margin-left: 14px * 4 + @box-margin * 4 + @box-padding;
            margin-right: @box-margin;
          }
          /deep/ .el-select {
            width: 130px;
            .el-input__inner {
              background-color: transparent !important;
            }
          }
        }
      }
      > .operationMain-item-chouse {
        background: @theme-color;
      }
    }
  }
}
</style>
