<template>
  <el-dialog
    class="monaco-editor-container"
    :modal="false"
    append-to-body
    :title="title"
    :visible.sync="showFlag"
  >
    <div
      class="editor-main"
      ref="editor"
      :style="{
        height: `${size.height}px`,
      }"
    ></div>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="cancel">取 消</el-button>
      <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as monaco from "monaco-editor";
import "monaco-editor/esm/vs/language/typescript/monaco.contribution";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

export default {
  data() {
    return {
      cache: {},
      showFlag: true,
      title: "修改数据",
      size: {
        width: window.innerWidth / 2,
        height: window.innerHeight / 2,
      },
      confirmFun: () => {},
      cancelFun: () => {},
    };
  },
  methods: {
    show(status, title, handler = { confirm: () => {}, cancel: () => {} }) {
      this.showFlag = status;
      this.title = title || "修改数据";
      this.confirmFun = handler.confirm || (() => {});
      this.cancelFun = handler.cancel || (() => {});
      return this;
    },
    setValue(data) {
      if (typeof data !== "string") {
        data = JSON.stringify(data);
      }
      this.cache.editor.setValue(data);
      this.cache.editor.getAction("editor.action.formatDocument").run();
      return this;
    },

    getValue() {
      return this.cache.editor.getValue();
    },

    cancel() {
      this.setValue("").show(false).cancelFun();
    },
    confirm() {
      const data = JSON.parse(this.getValue());
      this.confirmFun(data);
      this.show(false);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.cache.editor = monaco.editor.create(this.$refs.editor, {
        theme: "vs-dark",
        language: "json",
      });
      this.showFlag = false;
    });
  },
};
</script>

<style lang="less" scoped>
.monaco-editor-container {
  // position: fixed;
  // top: 50%;
  // left: 50%;
  // z-index: 200;
  // transform: translate(-50%, );
}

.el-dialog {
  width: 100%;
  height: 100%;
}

.editor-main {
  width: 100%;
  height: 100%;
}
</style>
