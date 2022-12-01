<template>
  <div class="Sprite-container">
    <de-collapse-layout
      label="网格设置"
      icon="#iconshezhi"
      arrowPosition="left"
    >
      <template #container>
        <de-controller-select
          label="材质"
          :options="materialList"
          :prop="{
            label: 'name',
            value: 'vid',
          }"
          v-model="config.material"
          :animation="{
            target: config,
            attribute: 'material',
          }"
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
    materialList() {
      const list = [
        {
          name: "无",
          vid: "",
        },
      ];
      list.push(...Object.values(this.$store.getters["material/get"]));
      return list;
    },
  },
};
</script>

<style lang="less" scoped></style>
