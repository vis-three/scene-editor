<template>
  <div class="sceneStructure-container">
    <div class="sceneStructure-header">
      <div class="header-title">
        <vis-icon code="#iconfuji"></vis-icon>
        结构
      </div>
      <div class="header-operation">
        <el-input
          size="mini"
          suffix-icon="el-icon-search"
          placeholder="结构筛选"
          v-model="filterText"
        ></el-input>
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
        @node-click="clickNode"
        @node-drop="handleDrop"
        :filter-node-method="filterNode"
      >
        <div
          class="custom-tree-node"
          :class="{ 'custom-active': data.vid === activeObject.vid }"
          slot-scope="{ data }"
        >
          <div class="tips-box">
            <vis-icon :code="getIcon(data.type)"></vis-icon>
            <span v-text="data.name"></span>
          </div>
          <div class="operate-box">
            <vis-icon
              :code="data.visible ? '#iconkejian' : '#iconbukejian'"
              @click.native="triggleVisible(data)"
            ></vis-icon>
          </div>
        </div>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { CONFIGTYPE } from "vis-three";
import { engine, history } from "../../assets/js/VisFrame";
import { SelectionAction } from "../../assets/js/action/SelectionAction";
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
      console.log(this.$store.getters["scene/currentScene"]);
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
        true
      );
    },

    triggleVisible(data) {
      data.visible = !data.visible;
      engine.getConfigBySymbol(data.vid).visible = data.visible;
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
  }
}

.custom-active {
  background: @theme-color;
}
</style>
