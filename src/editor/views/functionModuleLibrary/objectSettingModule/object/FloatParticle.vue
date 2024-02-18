<template>
  <div class="obejct3D-container">
    <de-collapse-layout
      label="粒子设置"
      icon="#iconshezhi"
      arrow-position="left"
    >
      <template #container>
        <de-controller-number
          v-model="config.amount"
          :keyframe="false"
          label="数量"
          :step="1"
          :drag-multply="5"
          :min="0"
        />
        <de-controller-number
          v-model="config.size"
          :keyframe="false"
          label="尺寸"
          :step="1"
          :drag-multply="1"
          :min="0"
        />
        <de-controller-number
          v-model="config.opacity"
          :keyframe="false"
          label="透明度"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :max="1"
        />
        <de-controller-number
          v-model="config.floatRange"
          :keyframe="false"
          label="浮动范围"
          :step="0.1"
          :drag-multply="3"
          :min="0"
        />
        <de-controller-picker
          v-model="config.refColor"
          :keyframe="false"
          label="颜色"
        />
        <de-controller-number
          v-model="config.colorRange"
          :keyframe="false"
          label="色彩范围"
          :step="0.01"
          :drag-multply="3"
          :min="0"
          :max="1"
        />
        <de-controller-select
          v-model="config.alphaMap"
          :keyframe="false"
          label="粒子贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
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
  computed: {
    textureList() {
      const list = [
        {
          name: "无",
          vid: "",
        },
      ];
      const textureMap = this.$store.getters["texture/get"];
      Object.keys(textureMap).forEach((vid) => {
        list.push({
          vid,
          name: textureMap[vid].name,
        });
      });
      return list;
    },
  },
};
</script>

<style lang="less" scoped></style>
