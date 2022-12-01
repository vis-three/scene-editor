<template>
  <div class="sceneManager-container">
    <div class="sceneManager-header">
      <div class="header-title">
        <vis-icon code="#iconchangjing2"></vis-icon>
        场景
      </div>
      <div class="header-operation">
        <el-input
          size="mini"
          suffix-icon="el-icon-search"
          placeholder="场景筛选"
          v-model="filterText"
        ></el-input>
        <i
          class="el-icon-plus"
          v-tooltip.top="'添加场景'"
          @click="addScene"
        ></i>
      </div>
    </div>
    <div class="scene-manager-main">
      <div
        class="scene-tiem"
        :class="{ 'scene-active': currentScene.vid === item.vid }"
        v-for="item in sceneList"
        :key="item.vid"
        @click="triggleScene(item.vid)"
      >
        <span class="scene-message"><span v-text="item.name"></span></span>
        <span class="scene-operation">
          <vis-icon
            v-if="sceneList.length > 1"
            class="scene-delete"
            code="#iconshanchu"
            v-tooltip.top="'删除场景'"
            @click.native="deleteScene(item)"
          ></vis-icon>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { CONFIGTYPE, generateConfig } from "vis-three";
import { engine } from "../../assets/js/VisFrame";
import { v4 } from "uuid";
import Vue from "vue";

export default {
  data() {
    return {
      filterText: ""
    };
  },
  computed: {
    // 当前场景
    currentScene() {
      return this.$store.getters["scene/currentScene"];
    },
    sceneList() {
      return this.$store.getters["scene/list"].filter(elem =>
        this.filterText ? elem.name.includes(this.filterText) : true
      );
    }
  },

  methods: {
    // 添加场景
    addScene() {
      const newScene = Vue.observable(
        generateConfig(CONFIGTYPE.SCENE, {
          vid: v4()
        })
      );
      newScene.name = `场景-${newScene.vid.slice(-2)}`;
      engine.applyConfig(newScene).setScene(newScene.vid);
      this.$store.commit("scene/notify");
      this.triggleScene(newScene.vid);
    },
    // 切换场景
    triggleScene(vid) {
      this.$store.commit("scene/currentScene", vid);
      engine.setScene(vid);
    },
    // 删除场景
    deleteScene(item) {
      this.$confirm(`是否删除场景：${item.name}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // 递归移除场景中的所有物体
        const vids = [];
        const traverse = object => {
          if (object.children && object.children.length) {
            vids.push(...object.children);
            for (const vid of object.children) {
              const config = engine.getConfigBySymbol(vid);
              if (config) {
                traverse(config);
              } else {
                console.error(`can not found vid in engine`, vid);
              }
            }
            object.children.splice(0, object.children.length);
          }
        };

        traverse(item);
        engine.removeConfigBySymbol(...vids);

        // 移除场景
        engine.removeConfigBySymbol(item.vid);
        this.$store.commit("scene/notify");

        // 重新指定当前场景
        this.triggleScene(this.sceneList[0].vid);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.sceneManager-container {
  .boxSetting();
  background-color: @theme-backgroundColor;
}

.sceneManager-header {
  padding: @box-padding;
  .flexLayout(row, space-between, center);

  .header-title {
    .icon-container {
      color: @theme-color;
    }
  }

  .header-operation {
    .flexLayout(row, space-between, center);

    > * {
      margin-right: @box-margin / 2;
    }

    > i {
      cursor: pointer;
      .transitionSetting({color: @theme-color;});
    }
  }
}

.scene-manager-main {
  .boxSetting(100%, calc(100% - 40px));
  overflow: auto;

  .scene-active {
    background-color: @theme-color;
  }
}

.scene-tiem {
  font-size: 14px;
  padding: @box-padding / 2 @box-padding;
  cursor: pointer;
  .transitionSetting({background-color: @themeDarkHover-color;});
  .flexLayout(row, space-between, center);
}
.scene-delete {
  cursor: pointer;
}
</style>
