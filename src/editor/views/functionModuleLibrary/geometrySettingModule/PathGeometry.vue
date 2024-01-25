<template>
  <div class="pathGeometry-container">
    <de-collapse-layout
      label="路径"
      icon="#iconjichubianhuan"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-switch
          :keyframe="false"
          label="自动闭合"
          v-model="path.autoClose"
        ></de-controller-switch>
        <el-button
          size="mini"
          icon="el-icon-edit"
          :type="draw ? 'success' : 'primary'"
          style="width: 100%"
          @click="setDraw"
        >
          {{ draw ? "结束绘制" : "路径绘制" }}
        </el-button>
      </template>
    </de-collapse-layout>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  computed: {
    draw() {
      return this.$store.getters["path/draw"];
    },
    path() {
      return this.$store.getters["path/get"][this.config.path];
    },
  },
  methods: {
    setDraw() {
      if (!this.draw) {
        this.$store.commit("path/draw", {
          status: !this.draw,
          geometry: this.config,
        });
      } else {
        this.$store.commit("path/draw", {
          status: !this.draw,
          geometry: "",
        });
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
