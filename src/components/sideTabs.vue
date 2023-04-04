<script lang="jsx">
export default {
  props: {
    // 翻转
    flip: {
      type: Boolean,
      default: false,
    },
    // 是否缓存
    cache: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const control = new Array(this.$slots.default.length).fill(false);
    control[0] = true;
    return {
      control,
      activePlane: 0,
    };
  },

  render(h) {
    const slotDefault = this.$slots.default;
    const iconListDom = [];
    const planeListDom = [];

    slotDefault.forEach((vnode, i, arr) => {
      if (vnode.tag) {
        iconListDom.push(
          h(
            "div",
            {
              class: {
                "tab-icon-item": true,
                "active-tab-icon-item": this.control[i],
              },
              directives: [
                {
                  name: "tooltip",
                  value: `${vnode.componentOptions.propsData.title}`,
                  modifiers: {
                    left: !this.flip,
                    right: this.flip,
                  },
                },
              ],
              on: {
                click: () => {
                  this.control[this.activePlane] = false;
                  this.control[i] = true;
                  this.activePlane = i;
                  this.$forceUpdate();
                },
              },
            },
            [<vis-icon code={vnode.componentOptions.propsData.icon}></vis-icon>]
          )
        );
        if (this.cache) {
          planeListDom.push(
            <div
              class="tab-container-item"
              style={{ display: this.control[i] ? "block" : "none" }}
            >
              {vnode}
            </div>
          );
        } else {
          if (this.control[i]) {
            planeListDom.push(<div class="tab-container-item">{vnode}</div>);
          }
        }
      }
    });

    return (
      <div
        class="sideTabs-container"
        style={{ flexDirection: this.flip ? "row-reverse" : " row" }}
      >
        <div class="tab-icon-box">{iconListDom}</div>
        <div class="tab-division-line"></div>
        <div class="tab-container-box">{planeListDom}</div>
      </div>
    );
  },
};
</script>

<style lang="less" scoped>
@labelWidth: 25px;
.sideTabs-container {
  .flexLayout();
  .boxSetting();
  > .tab-icon-box {
    .boxSetting(@labelWidth, 100%);
    background: @theme-backgroundColor;
    .tab-icon-item {
      .boxSetting(@labelWidth, @labelWidth);
      .flexLayout(row, center, center);
      margin-bottom: 2px;
      background: @brighterTheme-backgroundColor;
      cursor: pointer;
      .transitionSetting({background: @themeDarkHover-color;});
    }
    .active-tab-icon-item {
      background: @theme-color;
    }
  }
  > .tab-division-line {
    background: @darkestTheme-backgroundColor;
    .boxSetting(2px, 100%);
  }
  .tab-container-box {
    .boxSetting(calc(100% - @labelWidth - 2px), 100%);
    background: @theme-backgroundColor;
    overflow: auto;
    > .tab-container-item {
      // padding: @box-padding;
    }
  }
}
</style>
