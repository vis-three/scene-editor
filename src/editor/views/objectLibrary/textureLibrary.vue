<template>
  <div class="texture-container">
    <div class="box-header">
      <el-input
        size="mini"
        prefix-icon="el-icon-search"
        placeholder="贴图筛选"
      ></el-input>
      <el-dropdown trigger="click" @command="addtexture">
        <el-button
          size="mini"
          icon="el-icon-circle-plus-outline"
          type="primary"
        >
          添加贴图
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in texture"
            :key="index"
            v-text="item.label"
            :command="item"
          ></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div class="box-container">
      <div class="texture-main">
        <div
          class="texture-elem"
          v-for="(item, index) in textureList"
          :key="index"
        >
          <div
            class="render-box"
            :class="{ active: active.vid === item.vid }"
            :id="item.vid"
            :ref="item.vid"
            @click="
              () => {
                $store.commit('texture/setCurrentTexture', item.vid);
              }
            "
          ></div>
          <div
            class="operate-box"
            v-tooltip.top="'删除'"
            @click="deleteTexture(item)"
          >
            <vis-icon code="#iconshanchu" color="red"></vis-icon>
          </div>
          <div
            class="element-title"
            v-text="item.name"
            v-tooltip.bottom="item.name"
          ></div>
        </div>
      </div>
    </div>

    <file-system ref="fileSystem"></file-system>
  </div>
</template>

<script>
import { engine, textureDisplayer } from "@/editor/assets/js/vis";
import {
  EquirectangularRefractionMapping,
  LinearEncoding,
  LinearFilter,
} from "three";
import {
  CONFIGTYPE,
  createSymbol,
  generateConfig,
} from "@vis-three/middleware";

const fileSystem = () => import("./textureLibrary/fileSystem.vue");

export default {
  components: {
    fileSystem,
  },
  data() {
    return {
      texture: [
        {
          icon: "#icontexture",
          label: "图片贴图",
          type: CONFIGTYPE.IMAGETEXTURE,
        },
        {
          icon: "#icontexture",
          label: "视频贴图",
          type: CONFIGTYPE.VIDEOTEXTURE,
        },
        {
          icon: "#icontexture",
          label: "盒状贴图",
          type: CONFIGTYPE.CUBETEXTURE,
        },
        {
          icon: "#icontexture",
          label: "加载贴图",
          type: CONFIGTYPE.LOADTEXTURE,
        },
      ],
      canvasMap: {}, // 材质展示器的map ： vid --> displayer
      watchMap: {}, // 监听器的map: vid --> $watch
    };
  },
  computed: {
    textureList() {
      return this.$store.getters["texture/get"];
    },
    active() {
      return this.$store.getters["texture/currentTexture"];
    },
    urls() {
      return this.$store.getters.urls;
    },
  },
  methods: {
    // 添加贴图方法
    addtexture(item) {
      this.$refs.fileSystem.open({
        confirm: ({ files: textureList }) => {
          console.log(textureList);
          if (item.type === CONFIGTYPE.CUBETEXTURE) {
            this.loadCubeTexture(textureList);
            return;
          }
          if (item.type === CONFIGTYPE.LOADTEXTURE) {
            this.loadLoadTexture(textureList);
            return;
          }
          this.loadTexture(textureList, item.type);
        },
      });
    },

    loadTexture(textureList, configType) {
      engine
        .loadConfigAsync({
          assets: textureList.map((elem) => {
            return {
              url: this.urls[`texture-${elem.id}`],
              ext: elem.ext,
            };
          }),
        })
        .then((event) => {
          textureList.forEach((elem) => {
            const vid = createSymbol();
            const config = generateConfig(configType, {
              vid,
              url: this.urls[`texture-${elem.id}`],
              name: `${elem.name}${vid.slice(-2)}`,
            });

            this.$store.commit("texture/add", config);
          });
        });
    },

    loadCubeTexture(textureList) {
      const cubeMap = {
        px: "",
        nx: "",
        py: "",
        ny: "",
        pz: "",
        nz: "",
      };
      const tips = Object.keys(cubeMap);

      textureList.forEach((data) => {
        tips.forEach((tip) => {
          if (data.name.toLocaleLowerCase().includes(tip)) {
            cubeMap[tip] = this.urls.get(data);
          }
        });
      });
      console.log(cubeMap);

      if (Object.values(cubeMap).includes("")) {
        this.$message.warning("贴图素材不完整，需要选择6张相关天空盒贴图！");
        return;
      }

      engine.loadResourcesAsync(Object.values(cubeMap)).then((event) => {
        const vid = createSymbol();
        const config = generateConfig(CONFIGTYPE.CUBETEXTURE, {
          vid,
          cube: cubeMap,
          name: `盒状贴图-${vid.slice(-2)}`,
        });
        this.$store.commit("texture/add", config);
      });
    },

    loadLoadTexture(textureList) {
      console.log(textureList);
      engine
        .loadConfigAsync({
          assets: textureList.map((elem) => {
            return {
              url: this.urls[`texture-${elem.id}`],
              ext: elem.ext,
            };
          }),
        })
        .then((event) => {
          textureList.forEach((elem) => {
            const config = engine.generateLoadTextureConfig(
              this.urls[`texture-${elem.id}`]
            );
            config.name = `${elem.name}-${config.vid.slice(-2)}`;
            console.log(config);
            this.$store.commit("texture/add", config);
          });
        });
    },
    updateTextureDisplay(vid) {
      textureDisplayer
        .setTexture(engine.compilerManager.getObjectBySymbol(vid))
        .render();

      let image = new Image();
      image.src = textureDisplayer.getDataURL();

      const canvas = this.canvasMap[vid];

      image.onload = () => {
        canvas.getContext("2d").drawImage(image, 0, 0, 75, 55);
      };
    },

    // 删除贴图
    deleteTexture(item) {
      this.$confirm(
        `是否删除贴图：${item.name}，场景中使用了相关贴图的材质也会受到影响。`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        // store删除
        this.$store.commit("texture/remove", item.vid);

        // canvas缓存
        this.$delete(this.canvasMap, item.vid);

        // watcher缓存
        const watcher = this.watchMap[item.vid];
        if (!watcher) {
          console.warn("找不到这个vid的监听器", item.vid);
        } else {
          watcher();
        }

        this.$delete(this.watchMap, item.vid);

        // traverse 所有物体的material
        let num = 0;

        Object.values(this.$store.getters["material/get"]).forEach((config) => {
          let flag = false;
          Object.keys(config).forEach((key) => {
            if (key.toLocaleLowerCase().includes("map")) {
              if (config[key] === item.vid) {
                config[key] = "";
                flag = true;
              }
            }
          });

          flag && (num += 1);
        });
        this.$message({
          type: "success",
          message: `删除成功! 影响了：${num} 个材质。`,
        });
      });
    },
  },

  watch: {
    textureList: {
      handler(newValue, oldValue) {
        this.$nextTick(() => {
          Object.keys(newValue).forEach((vid) => {
            // 生成展示器
            if (!this.$refs[vid]) {
              console.error(`can not found this dom: '${vid}'`);
              return false;
            }

            if (this.canvasMap[vid]) {
              return false;
            }

            const targetDom = this.$refs[vid][0];
            const canvas = document.createElement("canvas");

            canvas.setAttribute("width", 75);
            canvas.setAttribute("height", 55);

            targetDom.appendChild(canvas);

            this.canvasMap[vid] = canvas;

            // 主动监听当前对象的属性改变更新displayer
            this.watchMap[vid] = this.$watch(
              function () {
                return this.textureList[vid];
              },
              (newVal) => {
                this.updateTextureDisplay(vid);
              },
              {
                deep: true,
                immediate: true,
              }
            );
          });
        });
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
@boxWidth: 76px;
.texture-container {
  .boxSetting(100%, 70vh);
  .box-header {
    padding: @box-padding;
    .flexLayout(row, space-between, center);
    margin-bottom: @box-margin;
    > .el-input {
      margin-right: @box-margin;
    }
  }
  .box-container {
    height: calc(100% - 46px - @box-margin - 2 * @box-padding);
    .texture-main {
      .flexLayout(row, space-around, center);
      flex-wrap: wrap;
      width: 100%;
      max-height: calc(100% - 47px);
      overflow: auto;

      .texture-elem {
        position: relative;
        .boxSetting(@boxWidth, unset);
        margin-bottom: @box-margin;
        cursor: pointer;
        .transitionSetting({background-color: @themeDarkHover-color});
        &:hover .operate-box {
          // display: block;
          opacity: 1;
        }
        > .render-box {
          position: relative;
          .boxSetting(100%, 55px);
          background: @brighterTheme-backgroundColor;
          margin-bottom: @box-margin;
          .flexLayout(row, center, center);
        }
        .operate-box {
          opacity: 0;
          // display: none;
          padding: @box-padding / 3;
          .absolutePosition(0, 0, unset, unset);
          background: fade(@darkestTheme-backgroundColor, 60);
          .transitionSetting();
          z-index: 11;
        }
        > .element-title {
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .active {
          &::after {
            content: "";
            .boxSetting();
            box-shadow: 0 0 0 2px @theme-color inset;
            .absolutePosition();
            z-index: 10;
          }
        }
      }
    }
  }
}
</style>
