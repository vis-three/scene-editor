import{n as s,aj as a}from"./texture-7d506f8b.js";import"./three-c85558b8.js";var c=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"helperModel-container"},[n("de-collapse-layout",{attrs:{icon:"#icondengpao",label:"辅助"},scopedSlots:e._u([{key:"container",fn:function(){return[n("div",{staticClass:"helperModel-main"},e._l(e.helperModel,function(o,r){return n("div",{key:r,staticClass:"helperModel-elem",on:{click:function(p){return e.addHelperModel(o)}}},[n("div",{staticClass:"element-icon-box"},[n("vis-icon",{attrs:{code:o.icon}})],1),n("div",{staticClass:"element-title",domProps:{textContent:e._s(o.label)}})])}),0)]},proxy:!0}])})],1)},i=[];const d={data(){return{}},methods:{addHelperModel(e){const t=e.getConfig();t.vid=a(),t.icon=e.icon,t.name=`${e.label}${t.vid.slice(-2)}`,this.$store.commit("action/helperModelAdd",t)}}},l={};var _=s(d,c,i,!1,u,"7a38e74c",null,null);function u(e){for(let t in l)this[t]=l[t]}const m=function(){return _.exports}();export{m as default};