import Icon from "./icon";
import Popup from "./popup";
import Image from "./image";
export default (Vue) => {
  Vue.component(Icon.name, Icon);
  Vue.component(Popup.name, Popup);
  Vue.component(Image.name, Image);
};
