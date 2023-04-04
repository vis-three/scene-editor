import Icon from "./icon.vue";
import Popup from "./popup.vue";
import Image from "./image.vue";
export default (Vue) => {
  Vue.component(Icon.name, Icon);
  Vue.component(Popup.name, Popup);
  Vue.component(Image.name, Image);
};
