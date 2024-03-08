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
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="noticeVisible = false">
          关闭
        </el-button>
        <el-button size="mini" type="primary" @click="notPrompting">
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
import { markdown } from "../version/0-6-16.md";
import { version } from "@ROOT/package.json";
import URLParse from "url-parse";
import appApi from "@/assets/js/api/app.js";
import historyApi from "@/assets/js/api/history.js";

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
  async mounted() {
    const urlMsg = URLParse(window.location.href, true);

    if (urlMsg.query.id !== undefined) {
      if (urlMsg.query.history !== undefined) {
        const history = await historyApi.getHistory(urlMsg.query.history);

        if (!history) {
          this.$message.error(`找不到该条历史记录！`);
          window.location.href =
            window.location.origin + window.location.pathname;
        } else if (Number(history.appId) !== Number(urlMsg.query.id)) {
          this.$message.error(`历史记录与应用不匹配！`);
          window.location.href =
            window.location.origin + window.location.pathname;
        } else {
          await appApi.saveApp({
            id: Number(urlMsg.query.id),
            name: history.name,
            app: history.app,
            editor: history.editor,
            preview: history.preview,
          });


          this.$store.commit("initProject", {
            id: history.appId,
            name: history.name,
          });
        }
      } else {
        const app = await appApi.getApp(urlMsg.query.id).catch((err) => {
          this.$message.error("接口有误：appApi/getApp");
          console.error(err);
        });

        this.$store.commit("initProject", {
          id: app.id,
          name: app.name,
        });
      }
    } else {
      this.$refs.workbench.visible = true;
    }

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
  background-color: @darkestTheme-backgroundColor;

  /deep/ .markdown {
    max-height: 60vh;
    overflow: auto;
  }
}
</style>
