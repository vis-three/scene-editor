<template>
  <div class="number-controller" :class="{ 'draging-box': draging }">
    <div
      v-if="showButton"
      v-show="!draging"
      class="operate-button reduce-button"
      @click="
        () => {
          calcValue(-1);
        }
      "
    >
      <vis-icon code="#iconbianjiantouzuo"></vis-icon>
    </div>
    <div class="input-box" @mousedown.stop="mousedown">
      <span
        v-if="!editing"
        class="input-elem"
        v-text="`${inputValue}${unit}`"
      ></span>
      <input
        v-else
        class="input-elem"
        type="text"
        :value="inputValue"
        ref="input"
        @change="inputChange"
      />
    </div>
    <div
      v-if="showButton"
      v-show="!draging"
      class="operate-button add-button"
      @click="
        () => {
          calcValue(1);
        }
      "
    >
      <vis-icon code="#iconbianjiantouyou"></vis-icon>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      // 步长
      type: Number,
      default: 1,
    },
    dragMultply: {
      // 拖拽倍率
      type: Number,
      default: 1,
    },
    min: {
      // 最小值
      type: Number,
      default: -Infinity,
    },
    max: {
      // 最大值
      type: Number,
      default: Infinity,
    },
    unit: {
      // 单位
      type: String,
      default: "",
    },
    // 显示精度
    displayAccuracy: {
      type: Number,
    },
    // 单位步长按钮
    showButton: {
      type: Boolean,
      default: true,
    },
    throttleTime: {
      type: Number,
      default: 1000 / 25,
    },
    value: {
      type: Number,
    },
  },
  data() {
    return {
      editing: false, // 正在编辑
      draging: false,
      throttleTimer: "", // 拖拽节流
      editTimer: "", // 判断双击激活
      editJudgeTime: 300,
      lastPosition: "", // 最后的位置缓存
      canMove: true, // 节流标识
    };
  },
  computed: {
    inputValue: {
      get() {
        return this.displayAccuracy !== undefined
          ? this.value.toFixed(this.displayAccuracy)
          : this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  methods: {
    // 鼠标按下事件
    mousedown($event) {
      // 正在编辑不影响
      if (this.editing) {
        return false;
      }
      // 如果存在定时器的时候触发说明是编辑
      if (this.editTimer) {
        clearTimeout(this.editTimer);
        this.editTimer = "";
        this.editing = true;
        this.$emit("touchEdit");
        const cancelEdit = () => {
          this.editing = false;
          document.removeEventListener("mousedown", cancelEdit);
        };
        document.addEventListener("mousedown", cancelEdit);
      } else {
        // 定时器跑完还未clear说明在进行拖动
        this.editTimer = setTimeout(() => {
          this.editing = false;
          this.editTimer = "";
          this.dragStart($event);
        }, this.editJudgeTime);
      }
    },
    // 拖动开始
    dragStart($event) {
      this.draging = true;
      document.body.style.cursor = "ew-resize";
      this.lastPosition = $event.clientX;
      const dragFun = (moveEvent) => {
        if (!this.canMove) {
          return false;
        } else {
          this.canMove = false;
          this.throttleTimer = setTimeout(() => {
            const mouseX = moveEvent.clientX;
            const direction = mouseX - this.lastPosition < 0 ? -1 : 1;
            this.calcValue(direction);
            this.lastPosition = mouseX;
            this.$emit("draging", { event: $event });
            this.canMove = true;
          }, this.throttleTime);
        }
      };
      const removeFun = () => {
        document.body.style.cursor = "default";
        this.draging = false;
        this.$emit("dragEnd");
        document.removeEventListener("mousemove", dragFun);
        document.removeEventListener("mouseup", removeFun);
      };

      document.addEventListener("mousemove", dragFun);
      document.addEventListener("mouseup", removeFun);
      this.$emit("dragStart", { event: $event });
    },
    // 计算
    calcValue(direction) {
      const accuracy =
        this.step < 1 ? this.step.toString().split(".")[1].length : 1;
      const step = this.draging
        ? direction * this.step * this.dragMultply
        : direction * this.step;
      this.checkValue(Number((this.value + step).toFixed(accuracy)));
    },
    // 输入框
    inputChange(event) {
      this.checkValue(Number(this.$refs.input.value));
    },
    // 判断值范围
    checkValue(value) {
      if (Number(value) < this.min) {
        value = this.min;
      } else if (Number(value) > this.max) {
        value = this.max;
      }
      this.inputValue = Number(value);
    },
  },
};
</script>

<style lang="less" scoped>
.number-controller {
  .flexLayout(row, space-between, center);
  background: @brighterTheme-backgroundColor;
  border-radius: 3px;
  height: 25px;
  overflow: hidden;
  .transitionSetting();
  &:hover .operate-button {
    opacity: 1;
  }
  > .operate-button {
    cursor: pointer;
    .boxSetting(25px, 25px);
    .flexLayout(row, center, center);
    opacity: 0;
    .transitionSetting({
      background: @themeHover-color;
    });
  }
  > .input-box {
    .flexLayout(row, center, center);
    .boxSetting();
    flex: 1;
    > .input-elem {
      flex: 1;
      width: 100%;
      text-align: center;
    }
    > span {
      cursor: ew-resize;
    }
  }
}
.draging-box {
  background: @themeDarkHover-color !important;
}
</style>
