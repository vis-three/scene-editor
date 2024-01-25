<template>
  <div class="eventGroup-container">
    <div class="eventGroup-header">
      <span class="header-tips">
        <i class="el-icon-position"></i>
        <span v-text="label"></span>
      </span>

      <div class="eventGroup-operation">
        <i
          class="el-icon-document-copy"
          v-tooltip.top="'复制事件'"
          @click="copyEvent"
        ></i>
        <i
          class="el-icon-document-checked"
          v-tooltip.top="'粘贴事件'"
          @click="passEvent"
        ></i>
        <el-dropdown trigger="hover">
          <i class="el-icon-circle-plus" v-tooltip.top="'添加事件'"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-cascader-panel
                v-model="cascaderValue"
                :options="configures"
                :props="{
                  expandTrigger: 'hover',
                  label: 'desp',
                  value: 'name',
                }"
                @change="change"
              ></el-cascader-panel>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="eventGroup-eventConfig">
      <event-controllers
        v-for="(item, index) in activeObject[eventName]"
        :key="index"
        :eventConfigure="item"
        @deleteEvent="deleteEvent(index)"
      ></event-controllers>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { EventGeneratorManager } from "@vis-three/middleware";
import { configures } from "@/editor/assets/js/eventLibrary";
import eventControllers from "./eventControllers.vue";
export default {
  components: {
    eventControllers,
  },
  props: {
    label: {
      type: String,
      default: "鼠标点击",
    },
    eventName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      configures,
      cascaderValue: ["empty", "empty"],
    };
  },
  computed: {
    activeObject() {
      return this.$store.getters["active/object"];
    },
  },
  methods: {
    change(value) {
      console.log(value);

      if (value[0] === "empty") {
        return;
      }
      if (value.length < 2) {
        console.error(`value length illeage.`);
        return;
      }

      const config = Vue.observable(
        EventGeneratorManager.generateConfig(value[1])
      );
      console.log(config);
      console.log(this.activeObject[this.eventName]);
      this.activeObject[this.eventName].push(config);
      this.cascaderValue = [];
    },

    deleteEvent(index) {
      this.$confirm(`是否删除此事件: ${this.eventName}-${index}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        console.log(this.eventName, index);
        this.activeObject[this.eventName].splice(index, 1);
        console.log(this.activeObject);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },

    copyEvent() {
      this.$store.commit(
        "clipBoard/copyEvent",
        this.activeObject[this.eventName]
      );
      this.$message.success("复制成功！");
    },

    passEvent() {
      const copyEvent = this.$store.getters["clipBoard/event"];

      if (!copyEvent || !copyEvent.length) {
        this.$message.warning("未复制事件。");
        return;
      }

      this.activeObject[this.eventName].push(...copyEvent);
      this.$message.success("粘贴成功！");
    },
  },
};
</script>

<style lang="less" scoped>
.eventGroup-container {
  margin-bottom: @box-margin;
}

.eventGroup-header {
  .flexLayout(row, space-between, center);
  width: 100%;
  .header-tips {
    > * {
      margin-right: @box-margin;
    }

    > i {
      color: @theme-color;
    }
  }
}

.eventGroup-eventConfig {
}

.eventGroup-operation {
  > i {
    margin-right: @box-margin;
    cursor: pointer;
    transition: all ease 500ms;
    &:hover {
      color: @theme-color;
    }
  }

  .el-icon-circle-plus {
    color: @theme-color;
    font-size: 16px;
  }
}

.el-dropdown-menu > .el-dropdown-menu__item:hover {
  background-color: transparent;
}
</style>
