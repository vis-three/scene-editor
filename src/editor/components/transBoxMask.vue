<template>
  <canvas
    ref="canvas"
    :width="maskSize.width"
    :height="maskSize.height"
    :style="{ cursor: cursor }"
    v-if="darging"
    class="transBoxMask-container"
    @mousemove="dargMove"
    @mouseup="dargEnd"
  ></canvas>
</template>

<script>
export default {
  name: "trans-box-mask",
  data() {
    return {
      id: "", // 联系组件id
      darging: "", // 激活拖拽
      cursor: "move", // 拖拽层的鼠标状态
      rotateStatus: false, // 旋转状态
      transStatus: false, // 变形状态
      transDirection: "", // 变形方向
      dargStartMouseX: "", // 起始鼠标位置X
      dargStartMouseY: "", // 起始鼠标位置Y
      bufferWidth: "", // 缓存的宽度
      bufferHeight: "", // 缓存的高度
      bufferTop: "", // 缓存的顶部距离
      bufferLeft: "", // 缓存的左边距离
      moveTop: "", // 本次移动的顶部距离
      moveLeft: "", // 本次移动的左部距离
      componentClientX: "", // 组件当前屏幕位置X
      componentClientY: "", // 组件当前屏幕位置Y
      xMap: "", // x的点集
      yMap: "", // y的点集
      componentListMap: "", // 组件的map集合
      adsorptionDistance: 5, // 吸附距离
      adsorptionComponentColor: "rgb(230, 20, 240)", // 吸附组件线条颜色
      adsorptionLineColor: "rgb(40, 245, 227)", // 吸附的线条颜色
      adsorptionTextColor: "rgb(230, 20, 240)", // 吸附文本颜色
    };
  },
  computed: {
    // 由于mask由div转为canvas所以需要动态获取尺寸
    maskSize() {
      return {
        width: this.$store.getters.getSizeWidth,
        height: this.$store.getters.getSizeHeight,
      };
    },
    // 圆心位置
    circleCenter() {
      const componentStructure = this.$store.getters.getComponentStructureById(
        this.id
      );
      return {
        x: this.componentClientX + componentStructure.width / 2,
        y: this.componentClientY + componentStructure.height / 2,
      };
    },
    // 圆y坐标
    circleYPosition() {
      return {
        x: this.circleCenter.x,
        y: this.circleCenter.y - 100,
      };
    },
    // 当前组件的结构信息
    componentStructure() {
      return this.$store.getters.getComponentStructureById(this.id);
    },
    // 吸附偏移范围
    adsorptionRange() {
      const rangeList = [];
      for (let i = 1; i <= this.adsorptionDistance; i += 1) {
        rangeList.push(i);
        rangeList.push(-i);
      }
      rangeList.push(0);
      return rangeList;
    },
    // 吸附状态
    adsorbentStatus() {
      return this.$store.getters.getAdsorbent;
    },
  },
  methods: {
    // 计算旋转 移动时候的鼠标位置
    calcRotate(x, y) {
      this.x = x;
      this.y = y;
      // 通过cos求
      const b = Math.sqrt(
        (this.circleYPosition.x - this.circleCenter.x) ** 2 +
          (this.circleYPosition.y - this.circleCenter.y) ** 2
      );
      const c = Math.sqrt(
        (x - this.circleCenter.x) ** 2 + (y - this.circleCenter.y) ** 2
      );
      const a = Math.sqrt(
        (x - this.circleYPosition.x) ** 2 + (y - this.circleYPosition.y) ** 2
      );

      const cosA = (b ** 2 + c ** 2 - a ** 2) / (2 * b * c);
      const arcconsA = Math.acos(cosA);
      const deg = (arcconsA * 180) / Math.PI;
      const trueDeg = x >= this.circleYPosition.x ? deg : 360 - deg;
      return parseInt(trueDeg);
    },
    // 拖拽移动
    dargMove(event) {
      this.moveTop = event.clientY - this.dargStartMouseY;
      this.moveLeft = event.clientX - this.dargStartMouseX;
      // 拖拽选中
      if (this.rotateStatus) {
        this.$store.commit("setComponentRotate", {
          id: this.id,
          rotate: this.calcRotate(event.clientX, event.clientY),
        });
      } else if (this.transStatus) {
        if (this.transDirection === "right") {
          this.$store.commit("setComponentSize", {
            id: this.id,
            width: this.bufferWidth + this.moveLeft,
            height: this.bufferHeight,
          });
        } else if (this.transDirection === "bottom") {
          this.$store.commit("setComponentSize", {
            id: this.id,
            width: this.bufferWidth,
            height: this.bufferHeight + this.moveTop,
          });
        } else if (this.transDirection === "bottom-right") {
          this.$store.commit("setComponentSize", {
            id: this.id,
            width: this.bufferWidth + this.moveLeft,
            height: this.bufferHeight + this.moveTop,
          });
        }
        if (this.adsorbentStatus) {
          // 吸附功能
          this.testAdsorbent();
        }
        // 拖拽移动
      } else {
        this.$store.commit("setComponentPosition", {
          id: this.id,
          top: this.bufferTop + this.moveTop,
          left: this.bufferLeft + this.moveLeft,
        });
        if (this.adsorbentStatus) {
          // 吸附功能
          this.testAdsorbent();
        }
      }
    },
    // 拖拽结束
    dargEnd(event) {
      const structure = this.componentStructure;
      this.darging = false;
      if (this.rotateStatus) {
        this.rotateStatus = false;
      } else if (this.transStatus) {
        this.transStatus = false;
        this.bufferWidth = structure.width;
        this.bufferHeight = structure.height;
      } else {
        this.bufferTop = structure.top;
        this.bufferLeft = structure.left;
      }
    },
    // 生成数据格式的map
    generateMap() {
      const xMap = {}; // x点集
      const yMap = {}; // y点集
      const componentListMap = {}; // 组件尺寸集合

      const maskSize = this.maskSize;
      // 初始画布的点集
      componentListMap.root = {
        xStart: 0,
        xCenter: parseInt(this.maskSize.width / 2),
        xEnd: maskSize.width,
        yStart: 0,
        yCenter: parseInt(this.maskSize.height / 2),
        yEnd: maskSize.height,
      };
      // 初始辅助线点集
      const colGuideList = this.$store.getters.getColGuideList;
      const rowGuideList = this.$store.getters.getRowGuideList;
      colGuideList.forEach((elem) => {
        componentListMap[`guide${elem.text}`] = {
          xStart: elem.text,
          xCenter: 0,
          xEnd: 0,
          yStart: 0,
          yCenter: 0,
          yEnd: 0,
        };
      });
      rowGuideList.forEach((elem) => {
        componentListMap[`guide${elem.text}`] = {
          xStart: 0,
          xCenter: 0,
          xEnd: 0,
          yStart: elem.text,
          yCenter: 0,
          yEnd: 0,
        };
      });
      // 初始各个组件的点集
      const componentStructure = this.$store.getters.getComponentStructureList;
      for (const key in componentStructure) {
        const elem = componentStructure[key];
        // 不生成自己本身的
        if (elem.id === this.id) {
          continue;
        }
        componentListMap[elem.id] = {
          xStart: elem.left,
          xCenter: parseInt(elem.left + elem.width / 2),
          xEnd: elem.left + elem.width,
          yStart: elem.top,
          yCenter: parseInt(elem.top + elem.height / 2),
          yEnd: elem.top + elem.height,
        };
      }

      // 根据componentListMap生成xMap和yMap
      const handleMap = (id, num, position) => {
        if (position[0] === "x") {
          if (xMap[num]) {
            xMap[num].push({
              id,
              position,
            });
          } else {
            xMap[num] = [
              {
                id,
                position,
              },
            ];
          }
        } else if (position[0] === "y") {
          if (yMap[num]) {
            yMap[num].push({
              id,
              position,
            });
          } else {
            yMap[num] = [
              {
                id,
                position,
              },
            ];
          }
        }
      };
      for (const id in componentListMap) {
        const elem = componentListMap[id];
        for (const position in elem) {
          handleMap(id, elem[position], position);
        }
      }
      this.xMap = xMap;
      this.yMap = yMap;
      this.componentListMap = componentListMap;
    },
    // 检测组件当前位置是否存在吸附
    testAdsorbent() {
      const adsorbentComponentData = {}; // 吸附的激活点集合

      const structure = this.componentStructure;
      // x位置
      const xStart = structure.left;
      const xCenter = parseInt(structure.left + structure.width / 2);
      const xEnd = structure.left + structure.width;
      // y位置
      const yStart = structure.top;
      const yCenter = parseInt(structure.top + structure.height / 2);
      const yEnd = structure.top + structure.height;
      const xMap = this.xMap;
      const yMap = this.yMap;

      // 吸附函数
      const adsorbent = (position, num) => {
        this.adsorptionRange.forEach((range) => {
          if (position[0] === "x" && xMap[num + range]) {
            adsorbentComponentData[position] = {
              range,
              map: xMap[num + range],
            };
          } else if (position[0] === "y" && yMap[num + range]) {
            adsorbentComponentData[position] = {
              range,
              map: yMap[num + range],
            };
          }
        });
      };
      // 检测6个位置的吸附
      adsorbent("xStart", xStart);
      adsorbent("xCenter", xCenter);
      adsorbent("xEnd", xEnd);
      adsorbent("yStart", yStart);
      adsorbent("yCenter", yCenter);
      adsorbent("yEnd", yEnd);
      // 应用吸附
      this.useAdsorbent(adsorbentComponentData);
    },
    // 应用吸附
    useAdsorbent(data) {
      const drawData = {
        x: {},
        y: {},
      };
      const structure = this.componentStructure;
      const top = structure.top;
      const left = structure.left;
      const width = structure.width;
      const height = structure.height;
      // 获取移动的吸附距离
      const getMoveAdsorbentRange = () => {
        let x = null;
        let y = null;
        for (const position in data) {
          const direction = position[0];
          if (direction === "x") {
            if (x === null || x > data[position].range) {
              x = data[position].range;
              drawData[direction] = {};
              drawData[direction][position] = data[position].map;
            } else if (x === data[position].range) {
              drawData[direction][position] = data[position].map;
            }
          } else {
            if (y === null || y > data[position].range) {
              y = data[position].range;
              drawData[direction] = {};
              drawData[direction][position] = data[position].map;
            } else if (y === data[position].range) {
              drawData[direction][position] = data[position].map;
            }
          }
        }
        return { x, y };
      };
      // 获取变换的吸附距离
      const getTransAdsorbentRange = () => {
        let x = null;
        let y = null;
        for (const position in data) {
          const direction = position[0];
          if (direction === "x") {
            if (x === null || x < Math.abs(data[position].range)) {
              // 中心点是 / 2处理，外加上向下取整，所以偏移量需要进行计算
              if (position.includes("Center")) {
                x = data[position].range * 2;
                if (width % 2 !== 0) {
                  x -= 1;
                }
              } else {
                x = data[position].range;
              }
              drawData[direction][position] = data[position].map;
            } else if (x === data[position].range) {
              drawData[direction][position] = data[position].map;
            }
          } else {
            if (y === null || y < Math.abs(data[position].range)) {
              if (position.includes("Center")) {
                y = data[position].range * 2;
                if (width % 2 !== 0) {
                  y -= 1;
                }
              } else {
                y = data[position].range;
              }
              drawData[direction][position] = data[position].map;
            } else if (y === data[position].range) {
              drawData[direction][position] = data[position].map;
            }
          }
        }
        return { x, y };
      };

      if (this.transStatus) {
        const { x: farRangeWidth, y: farRangeHeight } =
          getTransAdsorbentRange();
        // 应用吸附
        this.$store.commit("setComponentSize", {
          id: this.id,
          width: width + farRangeWidth,
          height: height + farRangeHeight,
        });
      } else {
        const { x: smallRangeLeft, y: smallRangeTop } = getMoveAdsorbentRange();
        // 应用吸附
        this.$store.commit("setComponentPosition", {
          id: this.id,
          top: top + smallRangeTop,
          left: left + smallRangeLeft,
        });
      }
      // 绘制吸附线条
      this.drawAdsorbent(drawData);
    },
    // 绘制吸附线条
    drawAdsorbent(data) {
      const structure = this.componentStructure;
      const currentComponentMap = {
        xStart: structure.left,
        xCenter: parseInt(structure.left + structure.width / 2),
        xEnd: structure.left + structure.width,
        yStart: structure.top,
        yCenter: parseInt(structure.top + structure.height / 2),
        yEnd: structure.top + structure.height,
      };
      const componentListMap = this.componentListMap;
      const maskSize = this.maskSize;
      const ctx = this.$refs.canvas.getContext("2d");

      ctx.clearRect(0, 0, maskSize.width, maskSize.height); // 清空画布

      const adsorbentLine = []; // 吸附线条点集
      const adsorbentComponent = []; // 组件线条点集
      const adsorbentRoot = {
        // 吸附根
        xStart: false,
        xCenter: false,
        xEnd: false,
        yStart: false,
        yCenter: false,
        yEnd: false,
      };
      // 画组件吸附线条
      const drawAdsorbentLine = () => {
        ctx.strokeStyle = this.adsorptionLineColor;
        ctx.fillStyle = this.adsorptionTextColor;
        ctx.setLineDash([0, 0]);
        ctx.font = "14px Arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        adsorbentLine.forEach((elem) => {
          const originPoint = elem.originPoint;
          const targetPoint = elem.targetPoint;
          // 当坐标都存在的时候才需要画线
          if (
            originPoint.x !== null &&
            originPoint.y !== null &&
            targetPoint.x !== null &&
            targetPoint.y !== null
          ) {
            ctx.beginPath();
            // 绘制线条
            ctx.moveTo(originPoint.x, originPoint.y);
            ctx.lineTo(targetPoint.x, targetPoint.y);
            ctx.stroke();
            // 绘制文本
            const positionX =
              originPoint.x > targetPoint.x
                ? targetPoint.x + (originPoint.x - targetPoint.x) / 2
                : originPoint.x + (targetPoint.x - originPoint.x) / 2;
            const positionY =
              originPoint.y > targetPoint.y
                ? targetPoint.y + (originPoint.y - targetPoint.y) / 2
                : originPoint.y + (targetPoint.y - originPoint.y) / 2;
            const space = Math.sqrt(
              (originPoint.x - targetPoint.x) ** 2 +
                (originPoint.y - targetPoint.y) ** 2
            );
            ctx.fillText(space, positionX, positionY);
            ctx.closePath();
          }
        });
      };
      // 画组件线条
      const drawComponentLine = () => {
        ctx.strokeStyle = this.adsorptionComponentColor;
        ctx.setLineDash([4, 4]);
        adsorbentComponent.forEach((elem) => {
          const componentMap = componentListMap[elem.id];
          let originPoint = {};
          let targetPoint = {};
          if (elem.position[0] === "x") {
            originPoint = {
              x: componentMap[elem.position],
              y: componentMap.yStart,
            };
            targetPoint = {
              x: componentMap[elem.position],
              y: componentMap.yEnd,
            };
          } else {
            originPoint = {
              x: componentMap.xStart,
              y: componentMap[elem.position],
            };
            targetPoint = {
              x: componentMap.xEnd,
              y: componentMap[elem.position],
            };
          }
          ctx.beginPath();
          // 绘制线条
          ctx.moveTo(originPoint.x, originPoint.y);
          ctx.lineTo(targetPoint.x, targetPoint.y);
          ctx.stroke();
          ctx.closePath();
        });
      };
      // 画根吸附线条
      const drawRootLine = () => {
        ctx.strokeStyle = this.adsorptionLineColor;
        ctx.setLineDash([0, 0]);
        ctx.beginPath();
        if (adsorbentRoot.xStart) {
          ctx.moveTo(0, 0);
          ctx.lineTo(0, maskSize.height);
        }
        if (adsorbentRoot.xCenter) {
          ctx.moveTo(maskSize.width / 2, 0);
          ctx.lineTo(maskSize.width / 2, maskSize.height);
        }
        if (adsorbentRoot.xEnd) {
          ctx.moveTo(maskSize.width, 0);
          ctx.lineTo(maskSize.width, maskSize.height);
        }
        if (adsorbentRoot.yStart) {
          ctx.moveTo(0, 0);
          ctx.lineTo(maskSize.width, 0);
        }
        if (adsorbentRoot.yCenter) {
          ctx.moveTo(0, maskSize.height / 2);
          ctx.lineTo(maskSize.width, maskSize.height / 2);
        }
        if (adsorbentRoot.yEnd) {
          ctx.moveTo(0, maskSize.height);
          ctx.lineTo(maskSize.width, maskSize.height);
        }
        ctx.stroke();
        ctx.closePath();
      };
      // 画辅助线线条
      const drawGuideLine = () => {};

      const xAdsorbentData = data.x;
      const yAdsorbentData = data.y;
      // 循环所有x位置产生的吸附
      for (const originPosition in xAdsorbentData) {
        let nearTargetId = "";
        let nearTargetComponentMap = "";
        let nearTargetPosition = "";
        // 对齐顺序，根>辅助线>组件
        // 循环统一x位置所有触发吸附的组件找出最近距离的组件
        for (const target of xAdsorbentData[originPosition]) {
          const targetId = target.id; // 目标组件的id
          const targetPosition = target.position;
          const targetComponentMap = componentListMap[target.id];
          const applyTarget = () => {
            nearTargetId = targetId;
            nearTargetComponentMap = targetComponentMap;
            nearTargetPosition = targetPosition;
          };
          if (targetId === "root") {
            adsorbentRoot[targetPosition] = true;
          } else {
            if (nearTargetId) {
              // yStart和yEnd绝对值最小的
              const distance = [
                Math.abs(
                  currentComponentMap.yStart - targetComponentMap.yStart
                ),
                Math.abs(currentComponentMap.yEnd - targetComponentMap.yEnd),
                Math.abs(currentComponentMap.yStart - targetComponentMap.yEnd),
                Math.abs(currentComponentMap.yEnd - targetComponentMap.yStart),
              ];
              const nearDistance = [
                Math.abs(
                  currentComponentMap.yStart - nearTargetComponentMap.yStart
                ),
                Math.abs(
                  currentComponentMap.yEnd - nearTargetComponentMap.yEnd
                ),
                Math.abs(
                  currentComponentMap.yStart - nearTargetComponentMap.yEnd
                ),
                Math.abs(
                  currentComponentMap.yEnd - nearTargetComponentMap.yStart
                ),
              ];
              if (
                Math.min.apply(Math, nearDistance) >
                Math.min.apply(Math, distance)
              ) {
                applyTarget();
              }
            } else {
              applyTarget();
            }
          }
        }
        if (
          nearTargetId &&
          nearTargetId !== "root" &&
          !nearTargetId.includes("guide")
        ) {
          let originPoint = {};
          let targetPoint = {};
          if (currentComponentMap.yStart > nearTargetComponentMap.yEnd) {
            originPoint = {
              x: currentComponentMap[originPosition],
              y: currentComponentMap.yStart,
            };
            targetPoint = {
              x: originPoint.x,
              y: nearTargetComponentMap.yEnd,
            };
          } else if (currentComponentMap.yEnd < nearTargetComponentMap.yStart) {
            originPoint = {
              x: currentComponentMap[originPosition],
              y: currentComponentMap.yEnd,
            };
            targetPoint = {
              x: originPoint.x,
              y: nearTargetComponentMap.yStart,
            };
          }
          adsorbentLine.push({
            originPoint,
            targetPoint,
          });
          adsorbentComponent.push({
            id: nearTargetId,
            position: nearTargetPosition,
          });
        }
      }
      // 循环y
      for (const originPosition in yAdsorbentData) {
        let nearTargetId = "";
        let nearTargetComponentMap = "";
        let nearTargetPosition = "";
        // 循环统一x位置所有触发吸附的组件找出最近距离的组件
        for (const target of yAdsorbentData[originPosition]) {
          const targetId = target.id; // 目标组件的id
          const targetPosition = target.position;
          const targetComponentMap = componentListMap[target.id];
          const applyTarget = () => {
            nearTargetId = targetId;
            nearTargetComponentMap = targetComponentMap;
            nearTargetPosition = targetPosition;
          };
          if (targetId === "root") {
            adsorbentRoot[targetPosition] = true;
          } else {
            if (nearTargetId) {
              // xStart和xEnd绝对值最小的
              const distance = [
                Math.abs(
                  currentComponentMap.xStart - targetComponentMap.xStart
                ),
                Math.abs(currentComponentMap.xEnd - targetComponentMap.xEnd),
                Math.abs(currentComponentMap.xStart - targetComponentMap.xEnd),
                Math.abs(currentComponentMap.xEnd - targetComponentMap.xStart),
              ];
              const nearDistance = [
                Math.abs(
                  currentComponentMap.xStart - nearTargetComponentMap.xStart
                ),
                Math.abs(
                  currentComponentMap.xEnd - nearTargetComponentMap.xEnd
                ),
                Math.abs(
                  currentComponentMap.xStart - nearTargetComponentMap.xEnd
                ),
                Math.abs(
                  currentComponentMap.xEnd - nearTargetComponentMap.xStart
                ),
              ];
              if (
                Math.min.apply(Math, nearDistance) >
                Math.min.apply(Math, distance)
              ) {
                applyTarget();
              }
            } else {
              applyTarget();
            }
          }
        }
        if (
          nearTargetId &&
          nearTargetId !== "root" &&
          !nearTargetId.includes("guide")
        ) {
          let originPoint = {};
          let targetPoint = {};
          if (currentComponentMap.xStart > nearTargetComponentMap.xEnd) {
            originPoint = {
              x: currentComponentMap.xStart,
              y: currentComponentMap[originPosition],
            };
            targetPoint = {
              x: nearTargetComponentMap.xEnd,
              y: originPoint.y,
            };
          } else if (currentComponentMap.xEnd < nearTargetComponentMap.xStart) {
            originPoint = {
              x: currentComponentMap.xEnd,
              y: currentComponentMap[originPosition],
            };
            targetPoint = {
              x: nearTargetComponentMap.xStart,
              y: originPoint.y,
            };
          }
          adsorbentLine.push({
            originPoint,
            targetPoint,
          });
          adsorbentComponent.push({
            id: nearTargetId,
            position: nearTargetPosition,
          });
        }
      }

      drawAdsorbentLine();
      drawComponentLine();
      drawGuideLine();
      drawRootLine();
    },
  },
  watch: {
    // 拖动激活的时候载入一次map
    darging(newValue, oldValue) {
      if (newValue) {
        this.generateMap();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.transBoxMask-container {
  .boxSetting();
  .absolutePosition();
  // background: pink;
  // > div {
  //   .absolutePosition();
  //   .boxSetting(5px, 5px);
  //   background: red;
  // }
}
</style>
