<template>
  <div class="obejct3D-container">
    <de-collapse-layout
      label="粒子设置"
      icon="#iconshezhi"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-number
          :keyframe="false"
          label="数量"
          :step="1"
          :dragMultply="5"
          :min="0"
          v-model="config.amount"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="尺寸"
          :step="1"
          :dragMultply="1"
          :min="0"
          v-model="config.size"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="透明度"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :max="1"
          v-model="config.opacity"
        ></de-controller-number>
        <de-controller-number
          :keyframe="false"
          label="浮动范围"
          :step="0.1"
          :dragMultply="3"
          :min="0"
          v-model="config.floatRange"
        ></de-controller-number>
        <de-controller-picker
          :keyframe="false"
          label="颜色"
          v-model="config.refColor"
        ></de-controller-picker>
        <de-controller-number
          :keyframe="false"
          label="色彩范围"
          :step="0.01"
          :dragMultply="3"
          :min="0"
          :max="1"
          v-model="config.colorRange"
        ></de-controller-number>
        <de-controller-select
          :keyframe="false"
          label="粒子贴图"
          :options="textureList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.alphaMap"
        ></de-controller-select>
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
