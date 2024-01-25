<template>
  <div class="pathDrawing-container">
    <div
      class="path-line-box"
      :class="{ 'active-box': drawPen === item.name }"
      v-tooltip="item.label"
      v-for="item in curveList"
      :key="item.name"
      @click="$store.commit('path/drawPen', item.name)"
    >
      <vis-icon :code="item.icon"></vis-icon>
    </div>

    <div
      class="exist-path-box"
      v-tooltip="'退出绘制'"
      @click="
        $store.commit('path/draw', {
          status: false,
          geometry: '',
        })
      "
    >
      <vis-icon code="#iconredo"></vis-icon>
    </div>
  </div>
</template>

<script>
import { engine } from "@/editor/assets/js/vis";
import {
  curveGenerator,
  curveEditManager,
} from "@/editor/assets/js/curveManager";
import Vue from "vue";
export default {
  data() {
    return {
      curveList: [
        {
          icon: "#iconzhexian",
          name: "line",
          label: "直线",
        },
        {
          icon: "#iconyuanhu",
          name: "arc",
          label: "圆弧",
        },
        {
          icon: "#iconercibeisaier",
          name: "quadratic",
          label: "二次贝塞尔",
        },
        {
          icon: "#iconsancibeisaier",
          name: "bezier",
          label: "三次贝塞尔",
        },
      ],
      count: 0,
    };
  },
  computed: {
    draw() {
      return this.$store.getters["path/draw"];
    },
    drawPen() {
      return this.$store.getters["path/drawPen"];
    },
    drawGeometry() {
      return this.$store.getters["path/drawGeometry"];
    },
    drawPath() {
      return this.$store.getters["path/drawPath"];
    },
  },
  watch: {
    draw: {
      handler(newVal) {
        const sketcher = engine.pathSketcher;
        if (newVal) {
          engine.selectionDisable = true;
          sketcher.addEventListener("write", (event) => {
            this.drawPath.curves.push(
              Vue.observable(curveGenerator[this.drawPen](event))
            );
            this.count += 1;
            this.drawGeometry.divisions = this.count * 100;
          });

          sketcher.addEventListener("move", (event) => {
            const segment =
              this.drawPath.curves[this.drawPath.curves.length - 1];

            if (segment.curve !== this.drawPen) {
              this.drawPath.curves.pop();
              const newSegment = curveGenerator[this.drawPen](event);
              newSegment.params[0] = segment.params[0];
              newSegment.params[1] = segment.params[1];

              this.drawPath.curves.push(newSegment);
            }
            curveEditManager[this.drawPen](
              event,
              this.drawPath.curves[this.drawPath.curves.length - 1]
            );
          });

          sketcher.addEventListener("end", (event) => {
            this.drawPath.curves.pop();
            engine.selectionDisable = false;
          });
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
.pathDrawing-container {
  .flexLayout(column);
}

.exist-path-box,
.path-line-box {
  .flexLayout(row, center, center);
  .boxSetting(30px, 30px, (@box-padding / 2), (@box-margin / 2));
  background-color: @theme-backgroundColor;
  border: 1px solid @themeDarkHover-color;
  cursor: pointer;
  .transitionSetting({
    background-color: @themeDarkHover-color;
  });
}

.exist-path-box {
  border-radius: 50%;
}
.active-box {
  background-color: @themeHover-color;
}
</style>
