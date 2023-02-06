<template>
  <div class="modelTapPlane-container" ref="container"></div>
</template>

<script>
import { fileSystemFactory } from "../fileSystem";
export default {
  components: {},
  props: {
    role: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fileSystem: "",
      fileTree: [], // 当前的文件树
      files: [], // 需要渲染的文件
    };
  },
  methods: {
    // 进入文件夹
    enter(item) {
      console.log(item);
    },
    updateFile() {},
  },
  created() {
    this.axios
      .post("api/file/structure", {
        role: this.role,
        type: "models",
      })
      .then((res) => {
        console.log(res);
        this.files = res.data.map((data) => {
          return {
            ...data,
          };
        });
        this.fileTree = res.data;
      });
  },
  mounted() {
    this.fileSystem = fileSystemFactory();
    this.$refs.container.appendChild(this.fileSystem.$el);
  },
};
</script>

<style lang="less" scoped></style>
