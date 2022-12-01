<script>
export default {
  props: {
    // 组件高度
    height: {
      type: String,
      default: "500px",
    },
    // 组件宽度
    width: {
      type: String,
      default: "300px",
    },
    // 布局方向 row 纵column
    direction: {
      type: String,
      default: "column",
    },
    // 面板个数
    amount: {
      type: Number,
      default: 2,
    },
    // 面板拖动的安全距离
    safeDistance: {
      type: Number,
      default: 24,
    },
    // 盒子拖动的安全距离
    boxSaveDistance: {
      type: Number,
      default: 100,
    },
    // 是否显示拖拽标识按钮
    showDragsign: {
      type: Boolean,
      default: true,
    },
    // 上方可拖拽
    dragTop: {
      type: Boolean,
      default: false,
    },
    // 下方可拖拽
    dragBottom: {
      type: Boolean,
      default: false,
    },
    // 左部可拖拽
    dragLeft: {
      type: Boolean,
      default: false,
    },
    // 右部可拖拽
    dragRight: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      spaceData: {}, // 记录间距
      showInnerMask: false, // 是否展示里层遮罩
      showOutMask: false, // 是否展示外部遮罩层
      lineDirection: "", // 外部拖拽线的方向
      boxWidth: "", // 盒子宽度
      boxHight: "", // 盒子高度
      mouseX: "", // 鼠标横轴位置
      mouseY: "", // 鼠标纵轴位置
      touchNum: "", // 拖拽线的父对象标识
    };
  },
  // 由于生成的dom树是递归循环的树形态所以用render
  render(h) {
    // 拖拽dom
    let dragDom = { class: "dragFlexPanel-drag" };
    // 视图dom
    let viewDom = { class: "dragFlexPanel-view" };
    // 窗口的拖拽线
    let dragLine = h("div", {
      class: {
        "dragFlexPanel-line": true,
        "dragFlexPanel-line-sign": this.showDragsign,
      },
      style:
        this.direction === "row"
          ? "height: 100%;width: 2px;right: 0;top: 0;"
          : "width: 100%;height: 2px;left: 0;bottom: 0;",
      on: {
        mousedown: this.dragLineMouseDown,
      },
    });
    // 最底层dom结构
    let lastHtml = h(
      "div",
      {
        attrs: {
          id: `drag${this.amount}`,
          class: `${dragDom.class}`,
        },
        ref: `drag${this.amount}`,
      },
      [<div class={viewDom.class}>{this.$slots[`view1`]}</div>, dragLine]
    );
    // 通过递归循环到dom结构树
    let packageHTML = (slotNum) => {
      if (slotNum === this.amount) {
        return lastHtml;
      } else {
        let view = h(
          "div",
          { attrs: { class: viewDom.class } },
          this.$slots[`view${this.amount - slotNum + 1}`]
        );
        return h(
          "div",
          {
            attrs: {
              id: `drag${slotNum}`,
              class: dragDom.class,
              style: `flex-direction: ${this.direction};`,
            },
            ref: `drag${slotNum}`,
          },
          [packageHTML(slotNum + 1), view, dragLine]
        );
      }
    };
    // 遮罩层 里层 防止触发里层的事件
    let innerMaskHtml = h("div", {
      attrs: {
        class: "dragFlexPanel-mask-inner",
      },
      style: {
        display: this.showInnerMask ? "block" : "none",
      },
      on: {
        mousemove: this.innerMaskMouseMove,
        mouseup: this.innerMaskMouseUp,
        mouseleave: this.innerMaskMouseLeave,
      },
      ref: "innerMask",
    });
    // 遮罩层 外层 防止出发外层事件
    let outerMaskHtml = h("div", {
      attrs: {
        class: "dragFlexPanel-mask-outer",
      },
      style: {
        display: this.showOutMask ? "block" : "none",
        cursor:
          this.lineDirection === "top" || this.lineDirection === "bottom"
            ? "ns-resize"
            : "ew-resize",
      },
      on: {
        mousemove: this.outerMaskMouseMove,
        mouseup: this.outerMaskMouseUp,
        mouseleave: this.outerMaskMouseLeave,
      },
      ref: "outerMask",
    });
    // 最后一层box还需要4个边形成整个box的拖拉变形
    let boxLineTop = h("div", {
      attrs: {
        style: "top: 0;left: 0;width: 100%;cursor: ns-resize;",
      },
      style: {
        display: this.dragTop ? "black" : "none",
      },
      class: {
        "dragFlexPanel-boxLine": true,
        "dragFlexPanel-boxLine-n": this.dragTop,
        "dragFlexPanel-boxLine-n-sign": this.dragTop && this.showDragsign,
      },
      ref: "boxLine-top",
      on: {
        mousedown: ($event) => this.boxLineMouseDown($event, "top"),
      },
    });
    let boxLineBottom = h("div", {
      attrs: {
        style: "bottom: 0;left: 0;width: 100%;cursor: ns-resize;",
      },
      style: {
        display: this.dragBottom ? "black" : "none",
      },
      class: {
        "dragFlexPanel-boxLine": true,
        "dragFlexPanel-boxLine-s": this.dragBottom,
        "dragFlexPanel-boxLine-s-sign": this.dragBottom && this.showDragsign,
      },
      ref: "boxLine-bottom",
      on: {
        mousedown: ($event) => this.boxLineMouseDown($event, "bottom"),
      },
    });
    let boxLineLeft = h("div", {
      attrs: {
        style: "top: 0;left: 0;height: 100%;cursor: ew-resize;",
      },
      style: {
        display: this.dragLeft ? "black" : "none",
      },
      class: {
        "dragFlexPanel-boxLine": true,
        "dragFlexPanel-boxLine-w": this.dragLeft,
        "dragFlexPanel-boxLine-w-sign": this.dragLeft && this.showDragsign,
      },
      ref: "boxLine-left",
      on: {
        mousedown: ($event) => this.boxLineMouseDown($event, "left"),
      },
    });
    let boxLineRight = h("div", {
      attrs: {
        style: "top: 0;right: 0;height: 100%;cursor: ew-resize;",
      },
      style: {
        display: this.dragRight ? "black" : "none",
      },
      class: {
        "dragFlexPanel-boxLine": true,
        "dragFlexPanel-boxLine-e": this.dragRight,
        "dragFlexPanel-boxLine-e-sign": this.dragRight && this.showDragsign,
      },
      ref: "boxLine-right",
      on: {
        mousedown: ($event) => this.boxLineMouseDown($event, "right"),
      },
    });
    // 最后包裹一层box
    return h(
      "div",
      {
        attrs: {
          class: "dragFlexPanel-box",
        },
        style: {
          flexDriection: this.direction,
          width: this.boxWidth,
          height: this.boxHeight,
          borderTopWidth: this.dragTop ? "1px" : "",
          borderBottomWidth: this.dragBottom ? "1px" : "",
          borderLeftWidth: this.dragLeft ? "1px" : "",
          borderRightWidth: this.dragRight ? "1px" : "",
        },
        ref: "box",
      },
      [
        packageHTML(1),
        innerMaskHtml,
        outerMaskHtml,
        boxLineTop,
        boxLineBottom,
        boxLineLeft,
        boxLineRight,
      ]
    );
  },
  methods: {
    // 设置距离
    setDistance() {
      // 计算高度 并 记录高度
      let dragHeight =
        (this.$refs.box.offsetHeight || parseInt(this.height)) / this.amount;
      for (let i = 2; i <= this.amount; i += 1) {
        let height = dragHeight * (this.amount - i + 1);
        this.$refs[`drag${i}`].style.height = `${height}px`;
        this.spaceData[i] = height;
      }
    },
    // 里层线按下事件
    dragLineMouseDown(event) {
      event.preventDefault();
      event.target.classList.add("dragFlexPanel-line-click");
      this.touchNum = event.target.parentNode.id.slice(4);
      this.showInnerMask = true;
    },
    // 遮罩层移动事件
    innerMaskMouseMove(event) {
      event.preventDefault();
      // // TODO: 横轴的以后再判断
      if (this.direction === "row") {
        this.$refs[`drag${this.touchNum}`].style.height = event.offsetX;
      } else {
        let height = event.offsetY; // 拖动的位置
        let upHeight =
          (this.spaceData[parseInt(this.touchNum) + 1] || 0) +
          this.safeDistance; // 上部的距离 考虑边缘
        let downHeight =
          (this.spaceData[parseInt(this.touchNum) - 1] ||
            this.$refs.box.offsetHeight) - this.safeDistance; // 下部距离 考虑边缘
        // 距离判断
        if (height <= upHeight) {
          this.$refs[`drag${this.touchNum}`].style.height = `${upHeight}px`;
        } else if (height >= downHeight) {
          this.$refs[`drag${this.touchNum}`].style.height = `${downHeight}px`;
        } else {
          this.$refs[`drag${this.touchNum}`].style.height = `${height}px`;
        }
        // console.log(height)
        // 刷新数据
        this.spaceData[this.touchNum] = parseInt(
          this.$refs[`drag${this.touchNum}`].style.height
        );
      }
    },
    // 遮罩层移出事件
    innerMaskMouseLeave(event) {
      event.preventDefault();
      this.innerMaskMouseUp();
    },
    // 遮罩层鼠标抬起事件
    innerMaskMouseUp(event) {
      this.showInnerMask = false;
      let dragLine = this.$refs[`drag${this.touchNum}`].lastElementChild;
      dragLine.classList.remove("dragFlexPanel-line-click");
    },
    // 盒子线按下事件
    boxLineMouseDown(event, direction) {
      event.preventDefault();
      // 开启外层遮罩
      this.showOutMask = true;
      // 记录鼠标位置
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
      // 记录拖拽方向
      this.lineDirection = direction;
      this.$refs[`boxLine-${this.lineDirection}`].classList.add(
        "dragFlexPanel-boxLine-click"
      );
    },
    // 遮罩层移动事件
    outerMaskMouseMove(event) {
      event.preventDefault();
      let widthDiff = event.clientX - this.mouseX;
      let heightDiff = event.clientY - this.mouseY;
      if (this.lineDirection === "top" || this.lineDirection === "bottom") {
        // 判断安全距离
        let height = parseFloat(this.boxHeight) + heightDiff;
        // 根据方向判断末尾距离
        if (this.direction === "column") {
          if (height <= this.spaceData[2] + this.boxSaveDistance) {
            this.$refs.box.style.height =
              this.spaceData[2] + this.boxSaveDistance;
          } else {
            this.$refs.box.style.height = `${height}px`;
          }
        } else {
          if (height <= this.boxSaveDistance) {
            this.$refs.box.style.height = this.boxSaveDistance;
          } else {
            this.$refs.box.style.height = `${height}px`;
          }
        }
      } else if (
        this.lineDirection === "right" ||
        this.lineDirection === "left"
      ) {
        // 判断安全距离
        let width = parseFloat(this.boxWidth) + widthDiff;
        // 根据方向判断末尾距离
        if (this.direction === "row") {
          // TODO: 判断横向的安全距离
        } else {
          if (width <= this.boxSaveDistance) {
            this.$refs.box.style.width = this.boxSaveDistance;
          } else {
            this.$refs.box.style.width = `${width}px`;
          }
        }
      }
    },
    // 遮罩层移出事件
    outerMaskMouseLeave(event) {
      event.preventDefault();
      this.outerMaskMouseUp();
    },
    // 遮罩层鼠标抬起事件
    outerMaskMouseUp(event) {
      this.showOutMask = false;
      // 刷新盒子长宽数据
      this.boxWidth = this.$refs.box.style.width;
      this.boxHeight = this.$refs.box.style.height;
      this.$refs[`boxLine-${this.lineDirection}`].classList.remove(
        "dragFlexPanel-boxLine-click"
      );
    },
  },
  watch: {
    height(newValue, oldValue) {
      this.boxHight = newValue;
    },
    width(newValue, oldValue) {
      this.boxWidth = newValue;
    },
  },
  created() {
    this.boxWidth = this.width;
    this.boxHeight = this.height;
  },
  mounted() {
    this.setDistance();
  },
};
</script>

<style lang="less">
@lineColor: rgb(0, 0, 0);
@lineHoverColor: rgb(209, 9, 182);
@lineClickColor: rgb(209, 9, 182);

.dragFlexPanel-box {
  display: flex;
  position: relative;
  border: 0 solid @lineColor;
  > .dragFlexPanel-boxLine {
    position: absolute;
    height: 3px;
    width: 3px;
    transition: all 300ms ease;
    &:hover::before {
      background: @lineHoverColor;
      box-shadow: 0 0 4px @lineHoverColor;
    }
    &::before {
      content: "";
      position: absolute;
      background: @lineColor;
      transition: all 300ms ease;
    }
    &::after {
      box-sizing: border-box;
      content: "";
      position: absolute;
      background: white;
      z-index: 1;
      transition: all 300ms ease;
    }
  }
  > .dragFlexPanel-boxLine-n {
    &::before {
      width: 100%;
      height: 1px;
      top: 0;
      left: 0;
    }
  }
  > .dragFlexPanel-boxLine-n-sign {
    &::after {
      width: 12px;
      height: 8px;
      top: 50%;
      left: 50%;
      margin-left: -6px;
      margin-top: -5px;
      border: 1px solid @lineColor;
    }
    &:hover::after {
      border: 1px solid @lineHoverColor;
    }
  }
  > .dragFlexPanel-boxLine-s {
    &::before {
      width: 100%;
      height: 1px;
      bottom: 0;
      left: 0;
    }
  }
  > .dragFlexPanel-boxLine-s-sign {
    &::after {
      width: 12px;
      height: 8px;
      top: 50%;
      left: 50%;
      margin-left: -6px;
      margin-top: -3px;
      border: 1px solid @lineColor;
    }
    &:hover::after {
      border: 1px solid @lineHoverColor;
    }
  }
  > .dragFlexPanel-boxLine-e {
    &::before {
      width: 1px;
      height: 100%;
      top: 0;
      right: 0;
    }
  }
  > .dragFlexPanel-boxLine-e-sign {
    &::after {
      width: 8px;
      height: 12px;
      top: 50%;
      left: 50%;
      margin-left: -3px;
      margin-top: -6px;
      border: 1px solid @lineColor;
    }
    &:hover::after {
      border: 1px solid @lineHoverColor;
    }
  }
  > .dragFlexPanel-boxLine-w {
    &::before {
      width: 1px;
      height: 100%;
      top: 0;
      left: 0;
    }
  }
  > .dragFlexPanel-boxLine-w-sign {
    &::after {
      width: 8px;
      height: 12px;
      top: 50%;
      left: 50%;
      margin-left: -5px;
      margin-top: -6px;
      border: 1px solid @lineColor;
    }
    &:hover::after {
      border: 1px solid @lineHoverColor;
    }
  }
  .dragFlexPanel-boxLine-click {
    &::before {
      background: @lineClickColor;
    }
    &::after {
      border-color: @lineClickColor;
    }
  }
  .dragFlexPanel-mask-inner {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    z-index: 10;
    cursor: ns-resize;
    background: transparent;
  }
  .dragFlexPanel-mask-outer {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  }
  .dragFlexPanel-drag {
    display: flex;
    height: 100%;
    width: 100%;
    position: relative;
    flex-shrink: 0;
  }
  .dragFlexPanel-drag:last-child {
    border-bottom: 0;
  }
  > .dragFlexPanel-drag {
    > .dragFlexPanel-line {
      display: none;
    }
  }

  .dragFlexPanel-view {
    overflow: auto;
    width: 100%;
    height: 100%;
  }
  .dragFlexPanel-line {
    position: absolute;
    cursor: ns-resize;
    &:hover::before {
      background: @lineHoverColor !important;
      box-shadow: 0 0 4px @lineHoverColor;
    }
    &::before {
      content: "";
      position: absolute;
      background: @lineColor;
      top: 1px;
      left: 0;
      height: 1px;
      width: 100%;
      transition: all 300ms ease;
    }
  }
  .dragFlexPanel-line-sign {
    &::after {
      content: "";
      position: absolute;
      width: 10px;
      height: 5px;
      top: 0;
      left: 50%;
      margin-left: -5px;
      z-index: 3;
      background: white;
      border: 1px solid @lineColor;
    }
    &:hover::after {
      border: 1px solid @lineHoverColor;
    }
  }
  .dragFlexPanel-line-click {
    &::before {
      background: @lineClickColor;
    }
    &::after {
      border: 1px solid @lineClickColor;
    }
  }
}
</style>
