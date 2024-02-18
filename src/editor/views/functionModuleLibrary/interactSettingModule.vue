<template>
  <div
    v-if="activeObject.vid"
    class="interactSettingModule-container"
  >
    <div class="eventSetting-title">
      <vis-icon code="#iconjihetuxing" />
      <de-controller-input
        v-model="activeObject.name"
        label="名称"
      />
    </div>
    <event-group
      v-for="item in activeEventList"
      :key="item.name"
      :label="item.label"
      :event-name="item.name"
    />
    <el-popover
      v-model="eventVisible"
      placement="bottom"
      width="400"
      trigger="click"
    >
      <div
        class="event-current"
        @click="showEvent = true"
      >
        <span>当前事件：</span>
        <span v-text="currentEvent.label" />
        <vis-icon
          v-tooltip="'编辑事件'"
          code="#iconbianji"
        />
      </div>
      <el-collapse-transition>
        <div
          v-show="showEvent"
          class="event-box"
        >
          <div
            v-for="item in eventList"
            :key="item.name"
            class="event-item"
            @click="addEvent(item)"
          >
            <vis-icon :code="item.icon" />
            <span v-text="item.label" />
          </div>
        </div>
      </el-collapse-transition>

      <el-cascader-panel
        v-show="!showEvent"
        v-model="cascaderValue"
        :options="configures"
        :props="{
          expandTrigger: 'hover',
          label: 'desp',
          value: 'name',
        }"
        @change="change"
      />

      <el-button
        slot="reference"
        type="primary"
        size="mini"
      >
        添加交互
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import eventGroup from "./interactSettingModule/eventGroup.vue";
import { configures } from "@/editor/assets/js/eventLibrary";
import { EventGeneratorManager } from "@vis-three/middleware";
import Vue from "vue";

export default {
  components: {
    eventGroup,
  },
  data() {
    return {
      showEvent: true,
      currentEvent: "",
      configures,
      cascaderValue: [],
      eventVisible: false,
      eventList: [
        {
          icon: "#iconjiaohu",
          name: "pointerdown",
          label: "鼠标按下",
        },
        {
          icon: "#iconjiaohu",
          name: "pointerup",
          label: "鼠标抬起",
        },
        {
          icon: "#iconjiaohu",
          name: "pointermove",
          label: "鼠标移动",
        },
        {
          icon: "#iconjiaohu",
          name: "pointerenter",
          label: "鼠标进入",
        },
        {
          icon: "#iconjiaohu",
          name: "pointerleave",
          label: "鼠标移出",
        },
        {
          icon: "#iconjiaohu",
          name: "click",
          label: "鼠标点击",
        },
        {
          icon: "#iconjiaohu",
          name: "dblclick",
          label: "鼠标双击",
        },
        {
          icon: "#iconjiaohu",
          name: "contextmenu",
          label: "鼠标右键",
        },
      ],
    };
  },

  computed: {
    activeObject() {
      return this.$store.getters["active/object"];
    },
    activeEventList() {
      return this.eventList.filter(
        (elem) => this.activeObject[elem.name].length
      );
    },
  },
  methods: {
    // 添加事件
    addEvent(item) {
      this.currentEvent = item;
      this.showEvent = false;
    },
    change(value) {
      console.log(value);

      if (value[0] === "empty") {
        return;
      }
      if (value.length < 2) {
        console.error(`value length illeage.`);
        return;
      }

      const eventName = this.currentEvent.name;

      window.EventGeneratorManager = EventGeneratorManager;
      const config = Vue.observable(
        EventGeneratorManager.generateConfig(value[1])
      );

      this.activeObject[eventName].push(config);
      this.cascaderValue = [];
      this.currentEvent = "";
      this.showEvent = true;
      this.eventVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.interactSettingModule-container {
  padding: @box-padding;
  width: 100%;

  .el-button {
    width: 100%;
  }
}

.eventSetting-title {
  .flexLayout();
  .icon-container {
    color: @theme-color;
    margin-right: (@box-margin / 2);
  }
}

.el-popover {
}

.event-current {
  color: white;
  margin-bottom: @box-margin;
  width: 50%;
  .flexLayout(row, space-around, center);
  cursor: pointer;
  .transitionSetting({
      background-color: @themeDarkHover-color;
    });
}
.event-box {
  width: 50%;
  .event-item {
    .flexLayout(row,  center, center);
    width: 100%;
    padding: (@box-padding / 2) 0;
    cursor: pointer;

    .transitionSetting({
      background-color: @themeDarkHover-color;
    });

    .icon-container {
      color: @theme-color;
      margin-right: @box-margin;
    }
    span {
      color: white;
    }
  }
}
</style>
