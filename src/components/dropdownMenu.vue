<template>
  <div class="dropdownSelect-container">
    <el-dropdown
      :trigger="trigger"
      @command="handleCommand"
      placement="bottom-start"
    >
      <span class="el-dropdown-link">
        <vis-icon v-if="icon" :code="icon"></vis-icon>
        <span v-text="label"></span>
      </span>
      <el-dropdown-menu slot="dropdown">
        <slot></slot>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  props: {
    trigger: {
      type: String,
      default: "click",
    },
    icon: {
      type: String,
    },
    label: {
      type: String,
      default: "菜单",
    },
  },
  methods: {
    handleCommand(event) {
      this.$emit("select", event);
    },
  },
};
</script>

<style lang="less" scoped>
.dropdownSelect-container {
  .boxSetting();
  .flexLayout(row, flex-start, center);
  > .el-dropdown {
    margin: 0 @box-margin;
    > .el-dropdown-link {
      > .icon-container {
        color: @theme-color;
        margin: 0 5px;
      }
      .transitionSetting({color: @themeHover-color;});
    }
  }
}
.el-dropdown-menu {
  width: 180px;
  > .el-dropdown-menu__item {
    .flexLayout(row, space-between, center);
    > .operate-name {
    }
    > .key-combination {
      color: @disabledText-color;
    }
  }
}
</style>
