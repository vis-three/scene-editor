<template>
  <div class="material-container">
    <div class="box-header">
      <el-input
        size="mini"
        prefix-icon="el-icon-search"
        placeholder="材质筛选"
      ></el-input>
      <el-dropdown trigger="click" @command="addMaterial">
        <el-button
          size="mini"
          icon="el-icon-circle-plus-outline"
          type="primary"
        >
          添加材质
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in material"
            :key="index"
            v-text="item.label"
            :command="item"
          ></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div class="box-container">
      <div class="material-main">
        <div
          class="material-elem"
          v-for="(item, index) in materialList"
          :key="index"
          @mousedown="changeCurrentMaterial(item.vid)"
        >
          <div
            draggable="true"
            class="render-box"
            :class="{ active: currentMaterial.vid === item.vid }"
            :id="item.vid"
            :ref="item.vid"
            @dragstart="dragstart($event, item.vid)"
          ></div>
          <div
            class="operate-box"
            v-tooltip.top="'删除'"
            @click="deleteMaterial(item)"
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
  </div>
</template>

<script>
import { v4 as getUuid } from "uuid";
import { engine, materialDisplayer } from "@/assets/js/VisFrame";
import { CONFIGTYPE, generateConfig } from "vis-three";

export default {
  data() {
    return {
      material: [
        {
          icon: "#icondengpao",
          label: "基础网格材质",
          material: CONFIGTYPE.MESHBASICMATERIAL,
        },
        {
          icon: "#icondengpao",
          label: "Phong网格材质",
          material: CONFIGTYPE.MESHPHONGMATERIAL,
        },
        {
          icon: "#icondengpao",
          label: "标准网格材质",
          material: CONFIGTYPE.MESHSTANDARDMATERIAL,
        },
        {
          icon: "#icondengpao",
          label: "物理网格材质",
          material: CONFIGTYPE.MESHPHYSICALMATERIAL,
        },
        {
          icon: "#icondengpao",
          label: "精灵材质",
          material: CONFIGTYPE.SPRITEMATERIAL,
        },
        {
          icon: "#icondengpao",
          label: "基础线条材质",
          material: CONFIGTYPE.LINEBASICMATERIAL,
        },
      ],
      canvasMap: {}, // 材质展示器的map ： vid --> canvas
      watchMap: {}, // 监听器的map: vid --> $watch
      timer: "",
      throttleTime: 1000 / 45,
      canMove: true,
    };
  },
  computed: {
    materialList() {
      return this.$store.getters["material/get"];
    },
    currentMaterial() {
      return this.$store.getters["active/material"];
    },
  },
  methods: {
    dragstart(event, vid) {
      event.preventDefault();
      this.$store.commit("material/setDraggedMaterial", vid);
      // 获取当前节点canvas讲canvas转为img
      const dragTarget = event.target;
      const canvasDomList = dragTarget.getElementsByTagName("canvas");
      if (canvasDomList.length > 0) {
        this.$store.commit("material/dragging", true);
        const canvas = canvasDomList[0];
        const image = new Image();
        image.src = canvas.toDataURL("image/png");
        image.style.position = "fixed";
        image.style.zIndex = 20;
        image.style.opacity = 0.6;
        document.body.appendChild(image);
        const dragMove = ($event) => {
          if (this.canMove) {
            this.canMove = false;
            this.timer = setTimeout(() => {
              image.style.top = `${$event.clientY + 10}px`;
              image.style.left = `${$event.clientX + 10}px`;
              this.canMove = true;
            }, this.throttleTime);
          }
        };
        const dragOver = ($event) => {
          document.body.removeChild(image);
          document.body.removeEventListener("mousemove", dragMove);
          document.body.removeEventListener("mouseup", dragOver);
        };
        document.body.addEventListener("mousemove", dragMove);
        document.body.addEventListener("mouseup", dragOver);
      } else {
        console.error("can not found canvas in this dom");
      }
    },

    addMaterial(item) {
      const vid = getUuid();
      const config = generateConfig(item.material, {
        vid,
        name: item.label + vid.slice(0, 2),
      });
      this.$store.commit("material/add", config);
      this.changeCurrentMaterial(config.vid);
    },

    changeCurrentMaterial(vid) {
      const material = this.$store.getters["material/get"][vid];
      this.$store.commit("active/material", material);
    },

    updateMaterialDisplay(vid) {
      materialDisplayer
        .setMaterial(engine.compilerManager.getObjectBySymbol(vid))
        .render();

      let image = new Image();
      image.src = materialDisplayer.getDataURL();

      const canvas = this.canvasMap[vid];

      image.onload = () => {
        canvas.getContext("2d").drawImage(image, 0, 0, 75, 55);
      };
    },

    // 删除材质
    deleteMaterial(item) {
      this.$confirm(
        `是否删除材质：${item.name}，场景中使用了相关材质的物体也会受到影响。`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        // store删除
        this.$store.commit("material/remove", item.vid);

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
        const objectMapList = [
          this.$store.getters["mesh/get"],
          this.$store.getters["line/get"],
          this.$store.getters["sprite/get"],
        ];

        let num = 0;

        objectMapList.forEach((map) => {
          Object.values(map).forEach((config) => {
            if (
              Array.isArray(config.material) &&
              config.material.includes(item.vid)
            ) {
              num += 1;
              config.material.forEach((mat, i, arr) => {
                if (mat === item.vid) {
                  arr.splice(i, 1);
                }
              });
            } else if (config.material && config.material === item.vid) {
              config.material = "";
              num += 1;
            }
          });
        });
        this.$message({
          type: "success",
          message: `删除成功! 影响了：${num} 个物体。`,
        });
      });
    },
  },
  watch: {
    materialList: {
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
                return this.materialList[vid];
              },
              (newVal) => {
                this.$nextTick(() => {
                  this.updateMaterialDisplay(vid);
                });
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

  mounted() {},
};
</script>

<style lang="less" scoped>
@boxWidth: 76px;
.material-container {
  .boxSetting(100%, 70vh);
  .box-header {
    .flexLayout(row, space-between, center);
    margin-bottom: @box-margin;
    padding: @box-padding;
    > .el-input {
      margin-right: @box-margin;
    }
  }
  .box-container {
    height: calc(100% - 46px - @box-margin - 2 * @box-padding);
    overflow: auto;
    background-color: @theme-backgroundColor;
    .material-main {
      .flexLayout(row, space-around, center);
      flex-wrap: wrap;
      width: 100%;

      .material-elem {
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
