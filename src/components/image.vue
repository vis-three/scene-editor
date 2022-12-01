<template>
  <el-image
    class="vis-image"
    :src="auth ? authSrc : src"
    :style="{
      width,
      height
    }"
  >
    <div slot="placeholder">
      <img src="/image/loading.gif" alt="加载中" />
    </div>
    <div slot="error">
      <img src="/image/error.png" alt="加载失败" />
    </div>
  </el-image>
</template>

<script>
import cacheManager from "./cacheManager";
export default {
  name: "vis-image",
  props: {
    // 图标code
    src: {
      type: String
    },
    fit: {
      type: String,
      default: "cover"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%"
    },
    auth: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      authSrc: ""
    };
  },
  watch: {
    auth: {
      handler(newVal, oldVal) {
        if (newVal && !oldVal) {
          if (cacheManager.has(this.src)) {
            this.authSrc = cacheManager.get(this.src);
            return;
          }

          this.axios
            .get(this.src, {
              responseType: "blob"
            })
            .then(res => {
              if (res.status === 500) {
                this.$message.error(res.message);
              } else {
                this.authSrc = URL.createObjectURL(res);
                cacheManager.set(this.src, this.authSrc);
              }
            });
        }
      },
      immediate: true
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {}
};
</script>

<style lang="less">
.vis-image {
  > div {
    .boxSetting();
    .flexLayout(row, center, center);
  }
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
  }
}
</style>
