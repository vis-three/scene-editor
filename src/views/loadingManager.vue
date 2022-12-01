<template>
  <div class="loadingManager-container" v-show="showLoading">
    <div class="loadingManage-main">
      <div v-if="loadError" class="loadingManager-close" @click="close">
        <vis-icon code="#iconguanbi"></vis-icon>
      </div>
      <div class="progress-title">
        <vis-icon code="#iconwenjian"></vis-icon>
        正在加载：{{ title }}
      </div>
      <div class="overall-progress-box">
        <div class="overall-progress">
          <div
            class="overall-progress-main"
            :style="{
              width: `${overllProgress}%`,
              backgroundColor: loadError ? '#FF4C4C' : null,
            }"
          ></div>
        </div>
        <span
          class="overall-number"
          v-text="`${loadSuccess}/${loadTotal}`"
        ></span>
      </div>
      <div class="detail-progress-box">
        <div
          class="detail-title"
          @click="
            () => {
              showDetail = !showDetail;
            }
          "
        >
          <span>展示详情</span>
          <vis-icon
            code="#iconxiala"
            :style="{
              transform: showDetail ? 'rotate(0)' : 'rotate(-90deg)',
            }"
          ></vis-icon>
        </div>
        <div v-if="showDetail" class="detail-message">
          <div
            class="detail-item"
            v-for="(item, index) in loadDetailMap"
            :key="index"
            :style="{ color: item.error ? '#FF4C4C' : null }"
          >
            <span class="detail-url" v-text="item.url"></span>
            <template v-if="!item.error">
              <span class="detail-seat"></span>
              <span
                class="detail-number"
                v-text="`${item.progress * 100}%`"
              ></span>
            </template>
            <span v-else v-text="item.message"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { engine } from "@/assets/js/VisFrame";

export default {
  data() {
    return {
      showLoading: false,
      showDetail: true,
      title: "",
      loadTotal: 0,
      loadSuccess: 0,
      loadError: 0,
      loadDetailMap: {},
    };
  },
  computed: {
    overllProgress() {
      if (this.loadTotal === 0) {
        return 0;
      } else {
        return (this.loadSuccess / this.loadTotal) * 100;
      }
    },
  },
  methods: {
    close() {
      this.showLoading = false;
    },
  },
  mounted() {
    const loaderManager = engine.loaderManager;

    loaderManager.addEventListener("beforeLoad", (event) => {
      !this.showLoading && (this.showLoading = true);
    });

    loaderManager.addEventListener("loading", (event) => {
      !this.showLoading && (this.showLoading = true);
      this.loadTotal = event.loadTotal;
      this.loadSuccess = event.loadSuccess;
      this.loadError = event.loadError;
    });

    loaderManager.addEventListener("loaded", (event) => {
      this.loadTotal = event.loadTotal;
      this.loadSuccess = event.loadSuccess;
      this.loadError = event.loadError;
      setTimeout(() => {
        this.showLoading = false;
      }, 1000);
    });

    loaderManager.addEventListener("detailLoaded", (event) => {
      this.title = event.url;
      this.loadDetailMap = loaderManager.getLoadDetailMap();
    });
  },
};
</script>

<style lang="less" scoped>
.loadingManager-container {
  .fixedPosition();
  .boxSetting();
  background: fade(@darkestTheme-backgroundColor, 50);
  .flexLayout(row, center, center);
  > .loadingManage-main {
    position: relative;
    .boxSetting(30%, unset, @box-padding @box-padding * 2);
    background: @theme-backgroundColor;
    border-radius: 5px;
    > .loadingManager-close {
      .absolutePosition(@box-margin, @box-margin, unset, unset);
      cursor: pointer;
      .transitionSetting(
        {color: @themeHover-color; transform: rotate(90deg) ;}
      );
    }
    > .progress-title {
      font-size: @smallTitle-fontSize;
      margin-bottom: @box-margin;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      > .icon-container {
        color: @theme-color;
      }
    }
    > .overall-progress-box {
      .flexLayout(row, center, center);
      margin-bottom: @box-margin;
      > .overall-progress {
        .boxSetting(100%, 30px);
        background: @darkerTheme-backgroundColor;
        margin-right: @box-margin;
        > .overall-progress-main {
          height: 100%;
          background: @theme-color;
          .transitionSetting();
        }
      }
    }
    > .detail-progress-box {
      > .detail-title {
        cursor: pointer;
        .transitionSetting({color: @themeHover-color;});
      }
      > .detail-message {
        .boxSetting(100%, 100px, @box-padding);
        overflow: auto;
        margin-top: @box-margin;
        background: @darkerTheme-backgroundColor;
        > .detail-item {
          .flexLayout(row, space-between, center);
          margin-bottom: @box-margin;
          .detail-seat {
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            margin: 0 @box-margin;
            border-top: 1px dashed @text-color;
          }
        }
      }
    }
  }
}
</style>
