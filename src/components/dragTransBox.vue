<template>
  <div
    class="dragTransBox-contaner"
    :style="{
      width: leftDrag || rightDrag ? `${size}px` : width,
      height: topDrag || bottomDrag ? `${size}px` : height,
    }"
  >
    <div
      class="dragBox-topDrag"
      v-if="topDrag"
      @mousedown="dragStart($event, 'top')"
    >
      <dragSignalRow></dragSignalRow>
    </div>
    <div
      class="dragBox-middleBox"
      :style="{ height: topDrag ? 'calc(100% - 20px)' : '100%' }"
    >
      <div
        class="dragBox-leftDrag"
        v-if="leftDrag"
        @mousedown="dragStart($event, 'left')"
      >
        <dragSignalColumn></dragSignalColumn>
      </div>
      <div class="dragBox-display">
        <slot></slot>
      </div>
      <div
        class="dragBox-rightDrag"
        @mousedown="dragStart($event, 'right')"
        v-if="rightDrag"
      >
        <dragSignalColumn></dragSignalColumn>
      </div>
    </div>
    <div
      class="dragBox-bottomDrag"
      v-if="bottomDrag"
      @mousedown="dragStart($event, 'bottom')"
    >
      <dragSignalRow></dragSignalRow>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      // 组件宽度
      type: String,
      default: "100%",
    },
    height: {
      // 组件高度
      type: String,
      default: "100%",
    },
    topDrag: {
      // 开启顶部拖拽
      type: Boolean,
      default: false,
    },
    leftDrag: {
      // 开启左拖拽
      type: Boolean,
      default: false,
    },
    rightDrag: {
      // 开启右拖拽
      type: Boolean,
      default: false,
    },
    bottomDrag: {
      // 开启顶部拖拽
      type: Boolean,
      default: false,
    },
    size: {
      // 拖拽尺寸
      type: Number,
      default: 100,
    },
    throttle: {
      // 节流
      type: Boolean,
      default: true,
    },
    throttleTime: {
      // 节流时间
      type: Number, // ms
      default: 1000 / 30,
    },
  },
  components: {
    // 横向拖拽标记
    dragSignalRow: {
      template: `
      <div class="dragBox-dragSignalRow">
        <div></div>
        <div></div>
        <div></div>
      </div>
      `,
    },
    // 纵向拖拽标记
    dragSignalColumn: {
      template: `
      <div class="dragBox-dragSignalColumn">
        <div></div>
        <div></div>
        <div></div>
      </div>
      `,
    },
  },
  data() {
    return {
      timer: "",
      canMove: true,
    };
  },
  methods: {
    // 拖动开始
    dragStart($event, cursor) {
      const dragFun = (moveEvent) => {
        // 设置鼠标指针
        document.body.style.cursor =
          this.topDrag || this.bottomDrag ? "ns-resize" : "ew-resize";

        if (!this.canMove) {
          return false;
        } else {
          this.timer = setTimeout(() => {
            const initialMouseX = $event.clientX;
            const initialMosuseY = $event.clientY;
            const mosuseY = moveEvent.clientY;
            const mouseX = moveEvent.clientX;

            const calcResult = {
              left: initialMouseX - mouseX,
              right: -(initialMouseX - mouseX),
              top: initialMosuseY - mosuseY,
              bottom: -(initialMosuseY - mosuseY),
            };

            this.$emit("draging", calcResult[cursor]);

            this.canMove = true;
          }, this.throttleTime);
        }
      };
      const removeFun = () => {
        document.body.style.cursor = "default";
        this.$emit("draged");
        document.removeEventListener("mousemove", dragFun);
        document.removeEventListener("mouseup", removeFun);
      };

      document.addEventListener("mousemove", dragFun);
      document.addEventListener("mouseup", removeFun);
    },
  },
};
</script>

<style lang="less" scoped>
@dragSignalSize: 20px;
.dragTransBox-contaner {
  .flexLayout(column, center, center);
  overflow: hidden;
  > .dragBox-topDrag {
    .boxSetting(100%, @dragSignalSize);
  }
  > .dragBox-middleBox {
    .boxSetting();
    .flexLayout();
    > .dragBox-display {
      .boxSetting(calc(100% - @dragSignalSize));
      flex: 1;
    }
    > .dragBox-leftDrag,
    > .dragBox-rightDrag {
      .boxSetting(unset);
      .flexLayout(column, center, center);
    }
  }

  // 拖拽标志
  /deep/ .dragBox-dragSignalRow {
    .boxSetting(100%, @dragSignalSize);
    .flexLayout(row, center, center);
    cursor: ns-resize;
    .transitionSetting(
      @hoverDo: {background: @themeHover-color;},
      @activeDo: {background: @theme-color;},
      @hoverElem: div,
      @activeElem: div
    );
    > div {
      .boxSetting(5px, 5px, 0, 2.5px);
      .transitionSetting();
      background: @placeHolderText-color;
    }
  }
  /deep/ .dragBox-dragSignalColumn {
    .boxSetting(@dragSignalSize);
    .flexLayout(column, center, center);
    cursor: ew-resize;
    .transitionSetting(
      @hoverDo: {background: @themeHover-color;},
      @activeDo: {background: @theme-color;},
      @hoverElem: div,
      @activeElem: div
    );
    > div {
      .boxSetting(5px, 5px, 0, 2.5px);
      .transitionSetting();
      background: @placeHolderText-color;
    }
  }
}
</style>
