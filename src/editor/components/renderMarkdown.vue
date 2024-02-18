<template>
  <vue-markdown
    class="markdown"
    :source="md"
  />
</template>

<script>
import VueMarkdown from "vue-markdown";

export default {
  components: {
    VueMarkdown,
  },
  props: {
    md: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="less" scoped>
.markdown {
  /deep/ h2 {
    margin: (@box-margin * 1.5) 0;
  }
  /deep/ h3 {
    margin: (@box-margin) 0;
  }

  /deep/ p {
    margin: (@box-margin / 2) 0;
  }

  /deep/ ul {
    > li {
      margin-left: 2rem;
      list-style: disc;
    }
  }

  /deep/ ol {
    > li {
      margin-left: 2rem;
      list-style: auto;
    }
  }

  /deep/ code {
    padding: 0 (@box-padding / 2);
    border-radius: 5px;
    background-color: grey;
    margin: 0 (@box-margin / 2);
  }
}
</style>
