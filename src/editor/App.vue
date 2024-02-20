<template>
  <div id="app">
    <editor-frame v-if="inited" />
    <loading-manager />
    <workbench ref="workbench" />

    <el-dialog
      title="更新公告"
      :visible.sync="noticeVisible"
      width="40%"
      center
    >
      <render-markdown :md="notice" />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          type="primary"
          @click="noticeVisible = false"
        >
          关闭
        </el-button>
        <el-button
          size="mini"
          type="primary"
          @click="notPrompting"
        >
          不再提示
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import editorFrame from "./views/editorFrame.vue";
import workbench from "./views/workbench.vue";
import renderMarkdown from "@/editor/components/renderMarkdown.vue";
import { markdown } from "../version/0-6-14.md";
import { version } from "../../package.json";

const loadingManager = () => import("./views/loadingManager.vue");

export default {
  components: {
    editorFrame,
    loadingManager,
    workbench,
    renderMarkdown,
  },
  data() {
    return {
      noticeVisible: false,
      notice: markdown,
    };
  },
  computed: {
    inited() {
      return this.$store.getters.id;
    },
  },
  mounted() {
    this.$refs.workbench.visible = true;

    const currentVersion = window.localStorage.getItem("version");

    if (version !== currentVersion) {
      this.noticeVisible = true;
    }
  },
  methods: {
    notPrompting() {
      window.localStorage.setItem("version", version);
      this.noticeVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
#app {
  .boxSetting();

  /deep/ .markdown {
    max-height: 60vh;
    overflow: auto;
  }
}
</style>
