<template>
  <div class="sceneStructure-container">
    <div class="sceneStructure-header">
      <div class="header-title">
        <vis-icon code="#iconfuji" />
        结构
      </div>
      <div class="header-operation">
        <el-input
          v-model="filterText"
          size="mini"
          suffix-icon="el-icon-search"
          placeholder="结构筛选"
          @focus="tips"
        />
      </div>
    </div>
    <div class="scene-manager-main">
      <el-tree
        ref="tree"
        :data="structure"
        :props="{
          children: 'children',
          label: 'name',
        }"
        :expand-on-click-node="false"
        draggable
        node-key="vid"
        :filter-node-method="filterNode"
        @node-click="clickNode"
        @node-drop="handleDrop"
      >
        <div
          slot-scope="{ data }"
          class="custom-tree-node"
          :class="{ 'custom-active': data.vid === activeObject.vid }"
        >
          <div class="tips-box">
            <vis-icon :code="getIcon(data.type)" />
            <span v-text="data.name" />
          </div>
          <div class="operate-box">
            <vis-icon
              v-tooltip="'显示隐藏'"
              :code="data.visible ? '#iconkejian' : '#iconbukejian'"
              @click.native="triggleVisible(data)"
            />
            <vis-icon
              v-tooltip="'删除'"
              code="#iconshanchu"
              @click.native="deleteObject(data)"
            />
          </div>
        </div>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { CONFIGTYPE, OBJECTMODULE } from "@vis-three/middleware";
import { engine, history } from "../../assets/js/vis";
import { SelectionAction } from "../../assets/js/action/SelectionAction";
import { DeleteObjectAction } from "../../assets/js/action/DeleteObjectAction";
export default {
  data() {
    return {
      active: "structure",
      treeData: [],
      filterText: "",
    };
  },
  computed: {
    // 当前场景
    currentScene() {
      return this.$store.getters["scene/currentScene"];
    },

    structure() {
      const objectMapList = this.$store.getters.objectMapList;

      const findObject = (vid) => {
        for (const map of objectMapList) {
          if (map[vid]) {
            return map[vid];
          }
        }
      };

      const traverse = (list, children) => {
        if (children.length) {
          for (const vid of children) {
            const object = findObject(vid);
            if (object) {
              const item = {
                vid: object.vid,
                name: object.name,
                visible: object.visible,
                children: [],
              };
              list.push(item);

              if (object.children) {
                traverse(item.children, object.children);
              }
            } else {
              console.error("找不到vid物体：", vid);
            }
          }
        }
      };

      const structureList = [];

      traverse(structureList, this.currentScene.children);

      return structureList;
    },

    activeObject() {
      return this.$store.getters["active/object"];
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },

  methods: {
    getIcon(type) {
      const TypIconeMap = {
        [CONFIGTYPE.MESH]: "#iconjihetuxing",
        [CONFIGTYPE.PERSPECTIVECAMERA]: "#iconxiangji1",
        [CONFIGTYPE.POINTLIGHT]: "#iconyuanxing",
      };

      return TypIconeMap[type] || "#iconjihetuxing";
    },

    clickNode(data) {
      history.apply(
        new SelectionAction({
          engine: engine,
          objectSymbols: [data.vid],
          store: this.$store,
        }),
        true,
      );
    },

    triggleVisible(data) {
      data.visible = !data.visible;
      engine.getConfigBySymbol(data.vid).visible = data.visible;
    },

    deleteObject(data) {
      this.$confirm(`是否删除物体：${data.name}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        history.apply(
          new DeleteObjectAction({
            store: this.store,
            engine,
          }),
          true,
        );
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },

    handleDrop(draggingNode, dropNode, dropType, ev) {
      const draggingData = draggingNode.data;
      const dropData = dropNode.data;

      const draggingConfig = engine.getConfigBySymbol(draggingData.vid);
      const dropConfig = engine.getConfigBySymbol(dropData.vid);

      if (dropType === "inner") {
        dropConfig.children.push(draggingData.vid);
        return;
      }

      if (dropType === "before" || dropType === "after") {
        const config = engine.getConfigBySymbol(dropData.vid);
        const dropConfig = engine.getConfigBySymbol(config.parent);
        if (!dropConfig.children.includes(draggingData.vid)) {
          dropConfig.children.push(draggingData.vid);
        }
        return;
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.includes(value);
    },
    tips() {
      this.$tool.devTips();
    },
  },
};
</script>

<style lang="less" scoped>
.sceneStructure-container {
  .boxSetting();
  background-color: @theme-backgroundColor;

  /deep/ .el-tree {
    .el-tree-node__expand-icon.is-leaf {
      display: none;
    }
  }
}

.sceneStructure-header {
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
      margin-right: (@box-margin / 2);
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
.custom-tree-node {
  .boxSetting();
  .flexLayout(row, space-between, center);
  padding: 0 @box-padding;

  .tips-box {
    > * {
      margin-right: @box-margin;
    }
  }

  .operate-box {
    > * {
      margin-left: (@box-margin / 2);
    }
  }
}

.custom-active {
  background: @theme-color;
}
</style>
