<template>
  <div
    class="componentTransBox-container"
    tabindex="-1"
    @focusin="focusin"
    @focusout="focusout"
    @dblclick="dblclick"
    @mousedown="dargStart"
    @mouseup="dargStop"
    ref="componentTransBox"
    :style="{
      top: `${top}px`,
      left: `${left}px`,
      'z-index': zIndex,
      opacity: opacity,
      width: `${width}px`,
      height: `${height}px`,
      transform: `rotate(${rotate}deg)`
    }"
  >
    <!-- 状态控件 STR -->
    <div
      class="status-box"
      :class="{
        'edit-status-box': editStatus,
        'hover-status-box': hoverStatus
      }"
    ></div>
    <!-- 状态控件 END -->
    <!-- 变换可视化 STR -->
    <div class="trans-box" v-show="showTrans">
      <div class="trans-line top-line" style="top: 0;left: 0;">
        <div class="drag-box"></div>
        <div class="trans-rotate-box" @mousedown.stop="rotateComponent">
          <mmd-icon code="#icon-xuanzhuan" color="rgb(230, 20, 240)"></mmd-icon>
        </div>
      </div>
      <div class="trans-line right-line" style="left: unset;top: 0;right: 0;">
        <div
          class="drag-box"
          @mousedown.stop="event => dragTrans(event, 'right', 'ew-resize')"
        ></div>
      </div>
      <div
        class="trans-line bottom-line"
        style="top: unset; bottom: 0;left: 0;"
      >
        <div
          class="drag-box"
          @mousedown.stop="event => dragTrans(event, 'bottom', 'ns-resize')"
        ></div>
      </div>
      <div class="trans-line left-line" style="top: 0;left: 0;">
        <div class="drag-box"></div>
      </div>
      <div
        class="drag-box corner-drag-box top-left"
        style="cursor: nw-resize;"
        :style="{ top: cornerOffest, left: cornerOffest }"
      ></div>
      <div
        class="drag-box corner-drag-box top-right"
        style="left: unset;cursor: ne-resize;"
        :style="{ top: cornerOffest, right: cornerOffest }"
      ></div>
      <div
        class="drag-box corner-drag-box bottom-left"
        style="top: unset;cursor: ne-resize;"
        :style="{ bottom: cornerOffest, left: cornerOffest }"
      ></div>
      <div
        class="drag-box corner-drag-box bottom-right"
        style="left: unset;top: unset;cursor: nw-resize;"
        :style="{ bottom: cornerOffest, right: cornerOffest }"
        @mousedown.stop="event => dragTrans(event, 'bottom-right', 'nw-resize')"
      ></div>
    </div>
    <!-- 变换可视化 END -->
    <!-- 组件位置 STR -->
    <div class="component-container" :id="`${idSign}${id}`"></div>
    <!-- 组件位置 END -->
  </div>
</template>

<script>
import Vue from "vue";
import store from "@displayEdiotr/store";
import transBoxMask from "./transBoxMask.vue";
export default {
  props: {
    newStatus: {
      // 是否为新增状态
      type: Boolean
    },
    top: {
      // 变换盒子的顶部距离
      type: Number
    },
    left: {
      // 变换盒子的左部距离
      type: Number
    },
    width: {
      // 组件宽度
      type: Number
    },
    height: {
      // 组件高度
      type: Number
    },
    zIndex: {
      // 图层顺序
      type: Number
    },
    opacity: {
      // 透明度
      type: Number
    },
    rotate: {
      // 旋转
      type: Number
    },
    id: {
      // 唯一domid标识
      type: Number
    },
    componentType: {
      // 组件类型
      type: String
    },
    config: {
      // 具体组件内部配置
      type: Array
    }
  },
  computed: {
    // 当前的组件结构
    componentStructure() {
      return this.$store.getters["ui/getComponentStructureById"](this.id);
    }
  },
  data() {
    return {
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,

      idSign: "componentTransBox", // id的标识
      cornerOffest: "-3px", // 边角的偏移量
      showTrans: false, // 变换展示
      editStatus: false, // 编辑状态
      hoverStatus: true, // hover状态
      mouseStatus: false, // 鼠标双击时是否在组件内部
      mousedownTimer: "", // mouseDown的定时器
      component: "", // 此盒子中渲染的组件
      mask: "" // 盒子中的辅助盒子
    };
  },
  methods: {
    // 聚焦时方法
    focusin() {
      if (!this.editStatus) {
        this.showTrans = true;
        this.hoverStatus = false;
        this.setKeyboard(); // 快捷键
        this.$store.commit("ui/setCurrentComponent", {
          component: this.component,
          id: this.id
        });
      }
    },
    // 组件失焦时方法
    focusout() {
      if (this.mouseStatus) {
        return false;
      } else {
        this.showTrans = false;
        this.editStatus = false;
        this.hoverStatus = true;
        // 优化性能
        this.$refs.componentTransBox.onmouseenter = null;
        this.$refs.componentTransBox.onmouseleave = null;
      }
    },
    // 双击激活组件
    dblclick() {
      // 双击的时候由于许多组件内部需要操作，会触发焦点的事件
      // 所以在双击的时候给组件绑定鼠标事件，
      // 如果鼠标在组件外触发了失焦事件，就运行相关操作，在内部触发就跳过操作
      this.mouseStatus = true;
      this.$refs.componentTransBox.onmouseenter = event => {
        this.mouseStatus = true;
      };
      this.$refs.componentTransBox.onmouseleave = event => {
        this.mouseStatus = false;
      };
      this.showTrans = false;
      this.hoverStatus = false;
      this.editStatus = true;
    },
    // 拖拽开始
    dargStart(event) {
      // 如果是编辑状态也不触发拖拽
      if (this.editStatus) {
        return false;
      }
      // 区分是双击还是拖拽开始
      clearTimeout(this.mousedownTimer);
      this.mousedownTimer = setTimeout(() => {
        this.mask.darging = true;
        this.mask.cursor = "move";
        this.mask.dargStartMouseX = event.clientX;
        this.mask.dargStartMouseY = event.clientY;
      }, 150);
    },
    // 拖拽暂停
    dargStop() {
      clearTimeout(this.mousedownTimer);
    },
    // 拖拽变形
    dragTrans(event, direction, cursor) {
      this.mask.darging = true;
      this.mask.transStatus = true;
      this.mask.transDirection = direction;
      this.mask.cursor = cursor;
      this.mask.dargStartMouseX = event.clientX;
      this.mask.dargStartMouseY = event.clientY;
    },
    // 组件旋转
    rotateComponent(event) {
      console.log(this.component.$el.getBoundingClientRect().top);
      this.mask.darging = true;
      this.mask.rotateStatus = true;
      this.mask.cursor = "grabbing";
      this.mask.dargStartMouseX = event.clientX;
      this.mask.dargStartMouseY = event.clientY;
      // 这里的圆心可以优化
      this.mask.componentClientX = this.component.$el.getBoundingClientRect().left;
      this.mask.componentClientY = this.component.$el.getBoundingClientRect().top;
    },
    // 设置快捷键
    setKeyboard() {
      const name = this.componentStructure.name;
      // keyboardJS.bind("delete", e => {
      //   this.$confirm(`确定删除${name}组件吗？`, "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning"
      //   })
      //     .then(() => {
      //       this.$store.commit("deleteComponent", this.id);
      //       this.$message({
      //         type: "success",
      //         message: "删除成功!"
      //       });
      //     })
      //     .catch(() => {
      //       this.$message({
      //         type: "info",
      //         message: "已取消删除"
      //       });
      //     });
      // });
    }
  },
  mounted() {
    // 通过extend的方式加入具体组件
    const defaultComponentList = this.$store.getters[
      "ui/getDefautComponentList"
    ];
    const Component = Vue.extend(defaultComponentList[this.componentType]);
    this.component = new Component();
    this.component.$mount(`#${this.idSign}${this.id}`);

    const Mask = Vue.extend(transBoxMask);
    const component = this;
    this.mask = new Mask({
      el: document.createElement("div"),
      data() {
        return {
          id: component.id,
          bufferWidth: component.width,
          bufferHeight: component.height,
          bufferTop: component.top,
          bufferLeft: component.left
        };
      },
      store
    }).$mount();
    const editorCanvasIframe = document.getElementById("editorCanvas-iframe");
    editorCanvasIframe.appendChild(this.mask.$el);
    // 加入store组件数据
    this.$store.commit("ui/addComponent", {
      id: this.id,
      component: this.component
    });
    // 判断是否为新增状态
    if (this.newStatus) {
      // 生成后马上focusin
      this.focusin();
    } else {
      // 加载需要注册事件方法和data
      const configList = this.componentStructure.configList;
      for (const key in configList) {
        this.component[key] = configList[key];
      }
      const eventList = this.componentStructure.eventList;
      eventList.forEach(eventElem => {
        eventElem.methodList.forEach(elem => {
          const saveParams = {};
          // 按顺序注册
          elem.params.forEach(paramElem => {
            saveParams[paramElem.name] = paramElem.value || paramElem.default;
          });
          this.component.applyEvent({
            eventName: eventElem.event,
            method: elem.name,
            params: saveParams
          });
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
@lineWidth: 1px;
@transBoxSize: 7px;
@rotationBoxSize: 10px;
.componentTransBox-container {
  .absolutePosition();
  outline: none;
  &:hover .hover-status-box {
    border: 2px solid @themeHover-color;
  }
  > .status-box {
    .absolutePosition();
    .boxSetting();
    border: 2px solid transparent;
  }
  > .edit-status-box {
    border: 1px dashed @theme-color;
    pointer-events: none;
  }
  > .hover-status-box {
    cursor: pointer;
  }
  > .trans-box {
    .boxSetting();
    .absolutePosition();
    cursor: pointer;
    > .trans-line {
      .absolutePosition();
      .flexLayout(row, center, center);
      background: @theme-color;
      box-shadow: 0 0 6px white;
      .trans-rotate-box {
        .absolutePosition(
          -30px,
          unset,
          unset,
          calc(50% - (@rotationBoxSize / 2))
        );
        .boxSetting(@rotationBoxSize, @rotationBoxSize);
      }
    }
    > .top-line,
    .bottom-line {
      height: @lineWidth;
      width: 100%;
      > .drag-box {
        cursor: ns-resize;
      }
    }
    > .left-line,
    .right-line {
      flex-direction: column;
      width: @lineWidth;
      height: 100%;
      > .drag-box {
        cursor: ew-resize;
      }
    }
    .drag-box {
      .boxSetting(@transBoxSize, @transBoxSize);
      border: 1px solid @theme-color;
      background: white;
      border-radius: 50%;
    }
    .corner-drag-box {
      .absolutePosition();
    }
  }
  > .drag-mask {
    .fixedPosition();
    z-index: 10;
    background: pink;
    cursor: move;
  }
}
</style>
