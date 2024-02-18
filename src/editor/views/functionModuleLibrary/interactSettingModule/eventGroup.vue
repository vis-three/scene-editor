<template>
  <div class="eventGroup-container">
    <div class="eventGroup-header">
      <span class="header-tips">
        <i class="el-icon-position" />
        <span v-text="label" />
      </span>

      <div class="eventGroup-operation">
        <i
          v-tooltip.top="'复制事件'"
          class="el-icon-document-copy"
          @click="copyEvent"
        />
        <i
          v-tooltip.top="'粘贴事件'"
          class="el-icon-document-checked"
          @click="passEvent"
        />
        <el-dropdown trigger="hover">
          <i
            v-tooltip.top="'添加事件'"
            class="el-icon-circle-plus"
          />
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
              />
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="eventGroup-eventConfig">
      <event-controllers
        v-for="(item, index) in activeObject[eventName]"
        :key="index"
        :event-configure="item"
        @deleteEvent="deleteEvent(index)"
      />
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
