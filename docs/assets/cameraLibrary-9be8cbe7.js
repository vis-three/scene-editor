import{n as r,i as o,a9 as i,aj as c}from"./texture-7d506f8b.js";import{A as s}from"./AddCameraAction-2d830623.js";import{o as l}from"./objectCollapse-e4ca0d9d.js";import"./three-c85558b8.js";var m=function(){var a=this,e=a.$createElement,n=a._self._c||e;return n("div",{staticClass:"camera-container"},[n("object-collapse",{attrs:{"data-list":a.camera,"click-hanlder":a.addCamera,icon:"#iconxiangji2",label:"相机"}})],1)},d=[];const _={components:{objectCollapse:l},data(){return{camera:[{icon:"#icontoushixiangji",label:"透视相机",camera:o.PERSPECTIVECAMERA},{icon:"#icontoushixiangji",label:"正交相机",camera:o.ORTHOGRAPHICCAMERA}]}},methods:{addCamera(a){const e=i(a.camera,{vid:c()});e.icon=a.icon,e.name=`${a.label}${e.vid.slice(-2)}`,VIS.history.apply(new s({config:e,store:this.$store,engine:VIS.engine}),!0)}}},t={};var u=r(_,m,d,!1,p,null,null,null);function p(a){for(let e in t)this[e]=t[e]}const g=function(){return u.exports}();export{g as default};