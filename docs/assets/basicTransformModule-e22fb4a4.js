import{n as c}from"./texture-7d506f8b.js";import"./three-c85558b8.js";var i=function(){var t=this,o=t.$createElement,a=t._self._c||o;return a("div",{staticClass:"basicTransformModule-container"},t._l(t.activeModelList,function(e,n){return a("de-collapse-layout",{key:n,attrs:{label:t.$store.getters["attribute/nameMap"][e],icon:t.$store.getters["attribute/iconMap"][e],"arrow-position":"left"},scopedSlots:t._u([{key:"container",fn:function(){return[a("de-controller-vector3",{attrs:{label:"位置",step:1,"display-accuracy":t.displayAccuracy,animation:{target:e,attribute:"position"}},model:{value:t.$store.getters["attribute/configMap"][e].position,callback:function(r){t.$set(t.$store.getters["attribute/configMap"][e],"position",r)},expression:"$store.getters['attribute/configMap'][item].position"}}),a("de-controller-vector3",{attrs:{label:"旋转",step:1,"display-accuracy":t.displayAccuracy,unit:"°",animation:{target:e,attribute:"rotation"}},model:{value:t.$store.getters["attribute/configMap"][e].rotation,callback:function(r){t.$set(t.$store.getters["attribute/configMap"][e],"rotation",r)},expression:"$store.getters['attribute/configMap'][item].rotation"}}),a("de-controller-vector3",{attrs:{label:"缩放",step:1,"display-accuracy":t.displayAccuracy,animation:{target:e,attribute:"scale"}},model:{value:t.$store.getters["attribute/configMap"][e].scale,callback:function(r){t.$set(t.$store.getters["attribute/configMap"][e],"scale",r)},expression:"$store.getters['attribute/configMap'][item].scale"}})]},proxy:!0}],null,!0)})}),1)},l=[];const u={data(){return{displayAccuracy:2,bufferData:"",activeModelList:[]}},computed:{},watch:{},methods:{}},s={};var p=c(u,i,l,!1,f,null,null,null);function f(t){for(let o in s)this[o]=s[o]}const g=function(){return p.exports}();export{g as default};