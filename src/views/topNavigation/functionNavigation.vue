<template>
  <div class="functionNavigation-container">
    <div class="function-part">
      <top-navigation-function-elem
        tooltip="撤销"
        icon="#iconredo"
        :active="undo"
        @click.native="
          () => {
            $store.commit('history/undo');
          }
        "
      ></top-navigation-function-elem>
      <top-navigation-function-elem
        tooltip="恢复"
        icon="#iconhuifu"
        :active="redo"
        @click.native="
          () => {
            $store.commit('history/redo');
          }
        "
      ></top-navigation-function-elem>
    </div>

    <div class="function-part">
      <top-navigation-function-elem
        tooltip="x轴"
        icon="#iconxzhou"
        :active="showX"
        @click.native="
          () => {
            transformControls.showX = !showX;
          }
        "
      ></top-navigation-function-elem>
      <top-navigation-function-elem
        tooltip="y轴"
        icon="#iconyzhou"
        :active="showY"
        @click.native="
          () => {
            transformControls.showY = !showY;
          }
        "
      ></top-navigation-function-elem>
      <top-navigation-function-elem
        tooltip="z轴"
        icon="#iconzzhou"
        :active="showZ"
        @click.native="
          () => {
            transformControls.showZ = !showZ;
          }
        "
      ></top-navigation-function-elem>
    </div>

    <div class="function-part">
      <top-navigation-function-elem
        tooltip="平移"
        icon="#iconpingyi"
        :active="mode === 'translate'"
        @click.native="
          () => {
            transformControls.mode = 'translate';
          }
        "
      ></top-navigation-function-elem>
      <top-navigation-function-elem
        tooltip="缩放"
        icon="#iconsuofang"
        :active="mode === 'scale'"
        @click.native="
          () => {
            transformControls.mode = 'scale';
          }
        "
      ></top-navigation-function-elem>
      <top-navigation-function-elem
        tooltip="旋转"
        icon="#iconxuanzhuan1"
        :active="mode === 'rotate'"
        @click.native="
          () => {
            transformControls.mode = 'rotate';
          }
        "
      ></top-navigation-function-elem>
    </div>

    <div class="function-part">
      <top-navigation-function-elem
        tooltip="本地变换"
        icon="#iconbendibianhuan"
        :active="space === 'local'"
        @click.native="
          () => {
            transformControls.space = 'local';
          }
        "
      ></top-navigation-function-elem>
      <top-navigation-function-elem
        tooltip="世界变换"
        icon="#iconshijiebianhuan"
        :active="space === 'world'"
        @click.native="
          () => {
            transformControls.space = 'world';
          }
        "
      ></top-navigation-function-elem>
    </div>

    <div class="function-part">
      <top-navigation-function-elem
        tooltip="步幅"
        icon="#iconxifu"
        :active="snapAllow"
        @click.native="
          () => {
            transformControls.snapAllow = !snapAllow;
          }
        "
      ></top-navigation-function-elem>
      <top-navigation-function-elem tooltip="平移">
        <el-input
          size="mini"
          v-model="transformControls.translationSnap"
        ></el-input>
      </top-navigation-function-elem>
      <top-navigation-function-elem tooltip="旋转">
        <el-input size="mini" v-model="rotationSnap"></el-input>
      </top-navigation-function-elem>
      <top-navigation-function-elem tooltip="缩放">
        <el-input size="mini" v-model="transformControls.scaleSnap"></el-input>
      </top-navigation-function-elem>
    </div>
  </div>
</template>

<script>
import topNavigationFunctionElem from "@/components/topNavigationFunctionElem.vue";
export default {
  components: {
    topNavigationFunctionElem,
  },
  data() {
    return {
      size: "20px",
    };
  },
  computed: {
    transformControls() {
      return this.$store.getters["controls/transformControls"];
    },
    mode() {
      return this.transformControls.mode;
    },
    space() {
      return this.transformControls.space;
    },
    showX() {
      return this.transformControls.showX;
    },
    showY() {
      return this.transformControls.showY;
    },
    showZ() {
      return this.transformControls.showZ;
    },
    snapAllow() {
      return this.transformControls.snapAllow;
    },
    rotationSnap: {
      get() {
        return (this.transformControls.rotationSnap * 180) / Math.PI;
      },
      set(value) {
        this.transformControls.rotationSnap = (value * Math.PI) / 180;
      },
    },
    redo() {
      return this.$store.getters["history/redoStatus"];
    },
    undo() {
      return this.$store.getters["history/undoStatus"];
    },
  },
};
</script>

<style lang="less" scoped>
.functionNavigation-container {
  padding-bottom: 3px;
  .flexLayout(row, center, center);

  .function-part {
    height: 100%;
    .flexLayout(row, center, center);
    margin: 0 @box-margin;

    > * {
      margin: 0 @box-margin / 4;
    }

    /deep/ .el-input input {
      padding: 0;
      text-align: center;
    }
  }

  /deep/ .edit-mode {
    .el-switch__core {
      border-color: @themeDarkHover-color !important;
      background-color: @themeDarkHover-color !important;
    }

    .el-switch__label.is-active {
      color: @theme-color;
    }

    .el-switch__label {
      color: @text-color;
    }
  }
}
</style>
