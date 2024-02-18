<template>
  <div class="operationController-container">
    <div class="operationGeneral-container">
      <div class="operationGeneral-search">
        <el-input
          v-model="searchValue"
          size="mini"
          placeholder="搜索"
          prefix-icon="el-icon-search"
        />
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
        />
        <vis-icon
          title="播放"
          :code="play ? '#iconzantingtingzhi' : '#iconbofang'"
          @click.native="togglePlay"
        />
        <vis-icon
          code="#iconkuaijin"
          @click.native="
            () => {
              $store.commit('animation/nextFrame');
            }
          "
        />
      </div>
    </div>
    <div class="operationMain-container">
      <!-- 标题栏 STR -->
      <div class="operationMain-title-box">
        <div class="operation-helper">
          <vis-icon
            code="#iconshanchu"
            type="error"
            title="删除"
          />
          <vis-icon
            code="#iconsanjiaojiantouyou"
            title="播放"
          />
          <vis-icon
            code="#iconshengyin"
            title="声音"
          />
        </div>
        <div class="operation-name">
          <vis-icon code="#iconbiaoqian" />
          <span>名称</span>
        </div>
        <div class="operation-add">
          <el-select
            v-model="selectObject"
            size="mini"
            filterable
            placeholder="选择添加物体"
            @change="addObject"
          >
            <el-option
              v-for="item in allObject"
              :key="item.vid"
              :label="item.name || item.vid"
              :value="item.vid"
            />
          </el-select>
        </div>
      </div>
      <!-- 标题栏 END -->
      <!-- 选项栏 STR -->
      <div
        ref="item-box"
        class="operationMain-item-box"
        @scroll="scroll"
      >
        <div
          v-for="(item, index) in animationMap"
          :key="index"
          class="operationMain-item"
          :class="{ 'operationMain-item-chouse': item.chouse }"
          @click="chouseObject(item)"
        >
          <div class="item-rootObject">
            <div class="item-helper">
              <div class="item-helper-checkBox">
                <vis-icon
                  code="#iconshanchu"
                  title="删除"
                  type="error"
                />
              </div>
              <div class="item-helper-checkBox">
                <vis-icon
                  v-show="item.lock"
                  code="#iconsanjiaojiantouyou"
                  title="播放"
                />
              </div>
              <div class="item-helper-checkBox">
                <vis-icon
                  v-show="item.voice"
                  code="#iconshengyin"
                  title="声音"
                />
              </div>
            </div>
            <div
              class="item-open-sign"
              @click="triggleItem(item)"
            >
              <vis-icon
                :class="{ 'sign-active': item.open }"
                style="transform: scale(0.7)"
                code="#iconsanjiaojiantouyou"
              />
            </div>
            <div class="item-name">
              <span v-text="getObjectName(index)" />
            </div>
            <div class="item-animation-select">
              <el-dropdown
                @command="
                  (command) => addAnimationCommand(command, index, item)
                "
              >
                <span class="el-dropdown-link">
                  <vis-icon
                    code="#iconjia1"
                    type="primary"
                    title="添加动画"
                  />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="load">
                    加载动画
                  </el-dropdown-item>
                  <el-dropdown-item command="script">
                    脚本动画
                  </el-dropdown-item>
                  <el-dropdown-item command="keyframe">
                    关键帧动画
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>

          <div
            v-if="animationTrack[index].load.length"
            v-show="item.open"
            class="load-animation-box"
          >
            <div
              v-for="(trackItem, trackIndex) in animationTrack[index].load"
              :key="trackIndex"
              class="item-track"
            >
              <span
                class="track-title"
                v-text="actionMap[trackItem].name"
              />

              <el-select
                v-model="actionMap[trackItem].clip"
                placeholder="选择加载动作"
                size="mini"
              >
                <el-option
                  v-for="item in clipList"
                  :key="item.vid"
                  :label="item.name"
                  :value="item.vid"
                />
              </el-select>
            </div>
          </div>
          <div
            v-if="Object.keys(animationTrack[index].script).length"
            v-show="item.open"
            class="script-animation-box"
          >
            <div
              v-for="(trackItem, trackIndex) in animationTrack[index].script"
              :key="trackIndex"
              class="item-track"
            >
              <span
                v-if="!trackItem.name"
                class="track-pickup"
                :class="{ 'track-pickup-active': trackItem.pickup }"
                @click="pickup(trackItem)"
              >
                拾取属性
                <vis-icon
                  code="#iconxiguan_huaban1"
                  color="white"
                />
              </span>
              <span
                v-else
                class="track-title"
                v-text="trackItem.name"
              />
              <el-select
                v-model="trackItem.script.name"
                placeholder="选择脚本"
                size="mini"
                @change="
                  change({
                    vid: index,
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
                />
              </el-select>
            </div>
          </div>
          <div
            v-if="Object.keys(animationTrack[index].keyframe).length"
            v-show="item.open"
            class="keyframe-animation-box"
          />
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
import { engine } from "../../assets/js/vis";
import aniScrpit from "@/editor/assets/js/aniScriptLibrary";
import Vue from "vue";

export default {
  data() {
    return {
      searchValue: "",
      clipCurrentTime: "00:00:00",
      aniScriptOptions: [],
      selectObject: "",
    };
  },
  computed: {
    animationMap() {
      return this.$store.getters["animation/editorMap"];
    },
    animationTrack() {
      return this.$store.getters["animationTrack/get"];
    },
    actionMap() {
      return this.$store.getters["animationAction/get"];
    },
    clipList() {
      return this.$store.getters["animationClip/list"];
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
    allObject() {
      const list = [].concat(this.$store.getters.objectMapList);
      list.push(
        this.$store.getters["material/get"],
        this.$store.getters["texture/get"]
      );

      return list.reduce((li, item) => {
        const objectList = Object.values(item);
        if (objectList.length) {
          li.push(...objectList);
        }

        return li;
      }, []);
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
    addObject(value) {
      this.$store.commit("animation/add", value);
      this.$store.commit("animationTrack/add", value);
      this.selectObject = "";
    },
    chouseObject() {},
    change({ vid, scirpt, item }) {
      if (item.script.name) {
        const config = generateConfig(
          CONFIGTYPE.SCRIPTANIMATION,
          {
            target: vid,
            attribute: item.attribute,
            script: AniScriptGeneratorManager.generateConfig(scirpt),
          },
          { strict: false }
        );
        engine.applyConfig(config);

        item.script.vid = config.vid;
      }
    },

    addAnimationCommand(command, vid, item) {
      const commandMap = {
        load: () => {
          if (!item.mixer) {
            const mixer = generateConfig(CONFIGTYPE.MIXERANIMATION, {
              target: vid,
            });

            item.mixer = mixer.vid;

            this.$store.commit("animation/addMixer", mixer);
          }
          item.open = true;

          const action = generateConfig(CONFIGTYPE.ANIMATIONACTION, {
            mixer: item.mixer,
          });

          action.name = `动作-${action.vid.slice(-2)}`;

          this.$store.commit("animationAction/add", action);
          this.$store.commit("animationTrack/addActionTrack", {
            object: vid,
            action: action.vid,
          });
        },
        script: () => {
          this.$store.commit("animationTrack/addEventTrack", {
            object: vid,
          });
          item.open = true;
        },
      };

      commandMap[command]();
    },

    pickup(item) {
      this.$store.commit("animationTrack/pickup", item);
    },
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

          > .item-animation-select {
            .boxSetting();
            .flexLayout(row, flex-end, center);
          }
        }
        .item-track {
          height: 20px;
          padding: 0 @box-padding;
          border-bottom: 1px solid @brighterTheme-backgroundColor;
          background: @darkestTheme-backgroundColor;
          .flexLayout();
          > .track-title,
          .track-pickup {
            margin-left: 14px * 4 + @box-margin * 4 + @box-padding;
            margin-right: @box-margin;
          }
          > .track-pickup {
            background-color: @brightestTheme-backgroundColor;
            padding: 0 4px;
          }
          > .track-pickup-active {
            background-color: @theme-color;
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

.load-animation-box {
  box-shadow: 0 0 0 1px rgb(255, 200, 100);
}
.script-animation-box {
  box-shadow: 0 0 0 1px rgb(100, 255, 100);
}

.keyframe-animation-box {
  box-shadow: 0 0 0 1px rgb(100, 185, 255);
}
</style>
