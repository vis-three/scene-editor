<template>
  <div class="VisAfterimagePass-container">
    <de-collapse-layout
      label="设置"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-number
          v-model="config.damp"
          label="程度"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :display-accuracy="2"
          :animation="{
            target: config.vid,
            attribute: 'damp',
          }"
        />
      </template>
    </de-collapse-layout>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="less" scoped>
.VisAfterimagePass-container {
}
</style>
