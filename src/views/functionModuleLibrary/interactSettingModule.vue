<template>
  <div class="interactSettingModule-container" v-if="activeObject.vid">
    <div class="eventSetting-title">
      <vis-icon code="#iconjihetuxing"></vis-icon>
      <de-controller-input
        label="名称"
        v-model="activeObject.name"
      ></de-controller-input>
    </div>
    <event-group
      v-for="item in activeEventList"
      :key="item.name"
      :label="item.label"
      :eventName="item.name"
    ></event-group>
    <el-popover
      placement="bottom"
      width="400"
      trigger="click"
      v-model="eventVisible"
    >
      <div class="event-current" @click="showEvent = true">
        <span>当前事件：</span>
        <span v-text="currentEvent.label"></span>
        <vis-icon code="#iconbianji" v-tooltip="'编辑事件'"></vis-icon>
      </div>
      <el-collapse-transition>
        <div class="event-box" v-show="showEvent">
          <div
            class="event-item"
            v-for="item in eventList"
            :key="item.name"
            @click="addEvent(item)"
          >
            <vis-icon :code="item.icon"></vis-icon>
            <span v-text="item.label"></span>
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
      ></el-cascader-panel>

      <el-button slot="reference" type="primary" size="mini">
        添加交互
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import eventGroup from "./interactSettingModule/eventGroup.vue";
import { configures } from "@/assets/js/eventLibrary";
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
