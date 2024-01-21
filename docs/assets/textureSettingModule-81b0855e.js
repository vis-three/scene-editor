import{n as u,_ as i}from"./index-9c012ccb.js";import{C as p,r as g,ae as f,b as m,bF as b,c4 as d,ar as v,c5 as x,c6 as y,N as l,L as o,ab as _,ad as F,ac as L,Y as M,c7 as R,c8 as h,c9 as k,ca as w,cb as $,R as S,cc as A,cd as E,ce as I,cf as N,cg as T,w as G,t as C}from"./three-6daa312a.js";var P=function(){var e=this,n=e.$createElement,a=e._self._c||n;return e.config?a("div",{staticClass:"textureSettingModule-container"},[a("de-collapse-layout",{attrs:{label:"贴图",icon:"#icontietushezhi",arrowPosition:"left"},scopedSlots:e._u([{key:"container",fn:function(){return[a("de-controller-input",{attrs:{label:"名称"},model:{value:e.config.name,callback:function(t){e.$set(e.config,"name",t)},expression:"config.name"}}),a("de-controller-input",{attrs:{label:"类型",disabled:""},model:{value:e.config.type,callback:function(t){e.$set(e.config,"type",t)},expression:"config.type"}})]},proxy:!0}],null,!1,3263285418)}),a("de-collapse-layout",{attrs:{label:"基础设置",icon:"#iconshezhi",arrowPosition:"left"},scopedSlots:e._u([{key:"container",fn:function(){return[a("de-controller-number",{attrs:{label:"旋转",step:1,dragMultply:3,min:0,max:360,unit:"°",displayAccuracy:0,animation:{target:e.config,attribute:"rotation"}},model:{value:e.rotation,callback:function(t){e.rotation=t},expression:"rotation"}}),a("de-controller-number",{attrs:{label:"中心点x",step:.01,dragMultply:3,displayAccuracy:2,animation:{target:e.config.center,attribute:"x"}},model:{value:e.config.center.x,callback:function(t){e.$set(e.config.center,"x",t)},expression:"config.center.x"}}),a("de-controller-number",{attrs:{label:"中心点y",step:.01,dragMultply:3,displayAccuracy:2,animation:{target:e.config.center,attribute:"y"}},model:{value:e.config.center.y,callback:function(t){e.$set(e.config.center,"y",t)},expression:"config.center.y"}}),a("de-controller-select",{attrs:{label:"x包裹",options:e.warpList,animation:{target:e.config,attribute:"wrapS"}},model:{value:e.config.wrapS,callback:function(t){e.$set(e.config,"wrapS",t)},expression:"config.wrapS"}}),e.config.wrapS!==e.warpList[0].value?a("de-controller-number",{attrs:{label:"x重复",step:1,min:1,dragMultply:2,animation:{target:e.config.repeat,attribute:"x"}},model:{value:e.config.repeat.x,callback:function(t){e.$set(e.config.repeat,"x",t)},expression:"config.repeat.x"}}):e._e(),a("de-controller-select",{attrs:{label:"y包裹",options:e.warpList,animation:{target:e.config,attribute:"wrapT"}},model:{value:e.config.wrapT,callback:function(t){e.$set(e.config,"wrapT",t)},expression:"config.wrapT"}}),e.config.wrapS!==e.warpList[0].value?a("de-controller-number",{attrs:{label:"y重复",step:1,min:1,dragMultply:2,animation:{target:e.config.repeat,attribute:"y"}},model:{value:e.config.repeat.y,callback:function(t){e.$set(e.config.repeat,"y",t)},expression:"config.repeat.y"}}):e._e(),a("de-controller-number",{attrs:{label:"x偏移",step:.01,min:0,max:1,dragMultply:3,displayAccuracy:2,animation:{target:e.config.offset,attribute:"x"}},model:{value:e.config.offset.x,callback:function(t){e.$set(e.config.offset,"x",t)},expression:"config.offset.x"}}),a("de-controller-number",{attrs:{label:"y偏移",step:.01,min:0,max:1,dragMultply:3,displayAccuracy:2,animation:{target:e.config.offset,attribute:"y"}},model:{value:e.config.offset.y,callback:function(t){e.$set(e.config.offset,"y",t)},expression:"config.offset.y"}}),a("de-controller-select",{attrs:{label:"映射类型",options:e.mappingList,animation:{target:e.config,attribute:"mapping"}},model:{value:e.config.mapping,callback:function(t){e.$set(e.config,"mapping",t)},expression:"config.mapping"}}),a("de-controller-select",{attrs:{label:"格式类型",options:e.formatList,animation:{target:e.config,attribute:"format"}},model:{value:e.config.format,callback:function(t){e.$set(e.config,"format",t)},expression:"config.format"}}),a("de-controller-select",{attrs:{label:"放大滤镜",options:e.magFilterList,animation:{target:e.config,attribute:"magFilter"}},model:{value:e.config.magFilter,callback:function(t){e.$set(e.config,"magFilter",t)},expression:"config.magFilter"}}),a("de-controller-select",{attrs:{label:"缩小滤镜",options:e.minFilterList,animation:{target:e.config,attribute:"minFilter"}},model:{value:e.config.minFilter,callback:function(t){e.$set(e.config,"minFilter",t)},expression:"config.minFilter"}}),a("de-controller-select",{attrs:{label:"编码类型",options:e.encodingList,animation:{target:e.config,attribute:"encoding"}},model:{value:e.config.encoding,callback:function(t){e.$set(e.config,"encoding",t)},expression:"config.encoding"}})]},proxy:!0}],null,!1,2023454587)}),a(e.type,{tag:"components",attrs:{config:e.config}})],1):e._e()},D=[];const s={},r=Object.assign({"./textureSettingModule/CubeTexture.vue":()=>i(()=>import("./CubeTexture-516a8265.js"),["assets/CubeTexture-516a8265.js","assets/index-9c012ccb.js","assets/three-6daa312a.js","assets/index-3dbea7c4.css"]),"./textureSettingModule/ImageTexture.vue":()=>i(()=>import("./ImageTexture-c5364c55.js"),["assets/ImageTexture-c5364c55.js","assets/index-9c012ccb.js","assets/three-6daa312a.js","assets/index-3dbea7c4.css"]),"./textureSettingModule/LoadTexture.vue":()=>i(()=>import("./LoadTexture-4b019e1f.js"),["assets/LoadTexture-4b019e1f.js","assets/index-9c012ccb.js","assets/three-6daa312a.js","assets/index-3dbea7c4.css"])});Object.keys(r).forEach(e=>{s[e.split("/").pop().replace(/.\/|\.vue$/g,"")]=r[e]});const V={components:s,data(){return{warpList:[{label:"末尾延展",value:p},{label:"重复覆盖",value:g},{label:"镜像覆盖",value:f}],mappingList:[{label:"UV",value:m},{label:"盒状反射",value:b},{label:"盒状折射",value:d},{label:"等矩形反射",value:v},{label:"等矩形折射",value:x},{label:"盒状UV反射",value:y}],magFilterList:[{label:"Nearest",value:l},{label:"Linear",value:o}],minFilterList:[{label:"Nearest",value:l},{label:"Linear",value:o},{label:"NearestMipmapNearest",value:_},{label:"NearestMipmapLinear",value:F},{label:"LinearMipmapNearest",value:L},{label:"LinearMipmapLinear",value:M}],formatList:[{label:"AlphaFormat",value:R},{label:"RedFormat",value:h},{label:"RedIntegerFormat",value:k},{label:"RGFormat",value:w},{label:"RGIntegerFormat",value:$},{label:"RGBAFormat",value:S},{label:"RGBAIntegerFormat",value:A},{label:"LuminanceFormat",value:E},{label:"LuminanceAlphaFormat",value:I},{label:"DepthFormat",value:N},{label:"DepthStencilFormat",value:T}],encodingList:[{label:"LinearEncoding",value:G},{label:"sRGBEncoding",value:C}]}},computed:{config(){return this.$store.getters["texture/currentTexture"]},type(){return this.config?this.config.type:!1},rotation:{get(){return this.config.rotation*180/Math.PI},set(e){this.config.rotation=e*Math.PI/180}}},methods:{}},c={};var B=u(V,P,D,!1,O,"6568e469",null,null);function O(e){for(let n in c)this[n]=c[n]}const z=function(){return B.exports}();export{z as default};