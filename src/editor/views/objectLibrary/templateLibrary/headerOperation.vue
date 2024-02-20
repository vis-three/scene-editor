<template>
  <div class="headerOperation-container">
    <div class="operate-history">
      <vis-icon
        code="#iconbianjiantouzuo"
        @click.native="
          () => {
            $store.commit('templateLibrary/backOffHistory');
          }
        "
      />
      <vis-icon
        code="#iconbianjiantouyou"
        @click.native="
          () => {
            $store.commit('templateLibrary/forwardHistory');
          }
        "
      />
    </div>
    <div class="operate-address">
      <span
        v-for="(item, index) in addressList"
        :key="index"
        class="address-sign-box"
        @click="chouseFile(item)"
      >
        <vis-icon
          v-if="index > 0"
          code="#iconsanjiaojiantouyou"
          :style="{ transform: 'scale(0.6)' }"
        />
        <span
          class="address-title"
          v-text="item.name"
        />
      </span>
    </div>
    <div class="operate-operation">
      <!-- <vis-icon code="#iconsetting-fill" v-tooltip.top="'设置'"></vis-icon> -->
      <el-popover
        v-model="classifyVisible"
        placement="bottom"
        width="200"
        trigger="click"
      >
        <el-input
          v-model="classifyName"
          class="popover-input"
          size="mini"
          placeholder="输入分类名称"
        />
        <div class="popover-operation">
          <el-button
            size="mini"
            type="text"
            @click="addClassify"
          >
            确定
          </el-button>
        </div>
        <vis-icon
          v-show="canAddClassify"
          slot="reference"
          v-tooltip.top="'新增分类'"
          code="#iconjia1"
        />
      </el-popover>

      <el-popover
        v-model="templateVisible"
        placement="bottom"
        width="200"
        trigger="click"
      >
        <el-input
          v-model="templateName"
          class="popover-input"
          size="mini"
          placeholder="输入模板名称"
        />
        <div class="popover-operation">
          <el-button
            size="mini"
            type="text"
            @click="addTemplate"
          >
            确定
          </el-button>
        </div>
        <vis-icon
          v-show="canUpload"
          slot="reference"
          v-tooltip.top="'当前场景保存为新模板'"
          code="#iconbaocun_mian"
        />
      </el-popover>

      <!-- <vis-icon
        code="#iconshangchuan-fill"
        v-tooltip.top="'上传'"
        v-if="canUpload"
        @click.native="upload"
      ></vis-icon>

      <input
        type="file"
        style="display: none"
        accept=".png, .jpg .mp4"
        ref="uploadInput"
        @change="fileHandler"
      /> -->
    </div>
  </div>
</template>

<script>
import { engine } from "@/editor/assets/js/vis";
import { CONFIGTYPE, MODULETYPE } from "@vis-three/middleware";
import templateApi from "@/assets/js/api/template.js";

export default {
  data() {
    return {
      classifyName: "", // 分类名
      classifyVisible: false,

      templateName: "",
      templateVisible: false,
    };
  },
  computed: {
    currentFloder() {
      return this.$store.getters["templateLibrary/currentFloder"];
    },
    // 可以上传的标识
    canUpload() {
      const floderChildren = this.currentFloder.children;
      if (floderChildren.length && !floderChildren[0].dir) {
        return true;
      } else if (!floderChildren.length && this.currentFloder.name !== "/") {
        return true;
      } else {
        return false;
      }
    },
    canAddClassify() {
      const floderChildren = this.currentFloder.children;
      if (floderChildren.length && floderChildren[0].dir) {
        return true;
      } else if (!floderChildren.length) {
        return true;
      } else {
        return false;
      }
    },
    addressList() {
      const result = [this.currentFloder];
      const traverse = (list) => {
        if (list.parent) {
          result.unshift(list.parent);
          traverse(list.parent);
        }
      };
      traverse(this.currentFloder);
      return result;
    },
  },
  methods: {
    chouseFile(item) {
      if (item.dir) {
        this.$store.commit("templateLibrary/currentFloder", item);
      }
    },
    upload() {
      this.$refs.uploadInput.click();
    },
    fileHandler(event) {
      const file = event.target.files[0];
      const formData = new FormData();

      formData.append("file", file);
      formData.append("classifyId", this.currentFloder.id);

      this.axios
        .upload("/config/upload", formData)
        .then((res) => {
          this.$store.commit("templateLibrary/addChildren", res.data);
        })
        .finally(() => {
          this.$refs.uploadInput.value = "";
        });
    },
    addClassify() {
      if (this.classifyName.trim()) {
        templateApi
          .addClassify({
            name: this.classifyName.trim(),
            parentId: this.currentFloder.id,
          })
          .then((res) => {
            this.$store.commit("templateLibrary/addChildren", res);
            this.classifyName = "";
            this.classifyVisible = false;
            this.$message.success("添加分类成功！");
          })
          .catch((err) => {
            this.$message.error(`数据库有误：templateApi.addClassify`);
            console.error(err);
          });
      } else {
        this.classifyName = "";
        this.classifyVisible = false;
      }
    },

    async addTemplate() {
      const loading = this.$message.loading("正在保存为模板...");
      let config = await this.$store.dispatch(
        "urlTransform",
        engine.exportConfig()
      );
      const editor = await this.$store.dispatch("exportConfig");
      // config.component = this.$store.getters["component/get"];
      // 模板去除全局灯光, 控制器, 渲染器, 多场景
      config[MODULETYPE.CONTROLS] && delete config[MODULETYPE.CONTROLS];
      config[MODULETYPE.RENDERER] && delete config[MODULETYPE.RENDERER];
      config[MODULETYPE.SCENE] && delete config[MODULETYPE.SCENE];
      config[MODULETYPE.PASS] && delete config[MODULETYPE.PASS];

      if (config[MODULETYPE.LIGHT]) {
        config[MODULETYPE.LIGHT].forEach((cfg, i, arr) => {
          if (
            [
              CONFIGTYPE.AMBIENTLIGHT,
              CONFIGTYPE.DIRECTIONALLIGHT,
              CONFIGTYPE.HEMISPHERELIGHT,
            ].includes(cfg.type)
          ) {
            arr.splice(i, 1);
          }
        });
      }

      templateApi
        .creatTemplate({
          name: this.templateName,
          classifyId: this.currentFloder.id,
          template: config,
          editor: editor,
          preview: await engine.getScreenshot({
            width: 960,
            height: 540,
          }),
        })
        .then((res) => {
          this.$message.success("保存成功！");
          this.templateName = "";
          this.templateVisible = false;
          this.$store.commit("templateLibrary/addChildren", res);
        })
        .finally(() => {
          loading.close();
        });
    },
  },
};
</script>

<style lang="less" scoped>
.headerOperation-container {
  .boxSetting(100%, 30px);
  background: @theme-backgroundColor;
  cursor: move;
  .flexLayout(row, space-between, center);
  position: relative;
  margin-bottom: @box-margin;
  > .operate-history {
    .flexLayout(row, center, center);
    > * {
      cursor: pointer;
      .boxSetting(30px, 30px);
      .flexLayout(row, center, center);
      background: @brighterTheme-backgroundColor;
      .transitionSetting({background: @themeHover-color;});
    }
    > div:first-child {
      margin-right: 1px;
    }
    margin-right: @box-margin;
  }
  > .operate-address {
    flex: 1;
    height: 100%;
    background: @darkerTheme-backgroundColor;
    .flexLayout(row, flex-start, center);
    padding: 0 @box-padding;
    cursor: default;
    > .address-sign-box {
      cursor: pointer;
      margin-right: (@box-margin / 2);
      .transitionSetting({color: @themeDarkHover-color;});
      .icon-container {
        margin-right: 2px;
      }
    }
  }
  > .operate-window {
    .absolutePosition(0, 0, unset, unset);
    cursor: pointer;
    .transitionSetting({color: @themeHover-color; transform: rotate(90deg) ;});
    .icon-container {
      padding: (@box-padding / 2);
    }
  }

  > .operate-operation {
    .flexLayout(row, center, center);

    .icon-container {
      font-size: 16px;
      font-weight: bold;
      margin-right: @box-margin;
      cursor: pointer;
      .transitionSetting({color: @theme-color;});
    }
  }
}

.popover-input {
  margin: @box-margin 0;
}
.popover-operation {
  text-align: center;
}
</style>
