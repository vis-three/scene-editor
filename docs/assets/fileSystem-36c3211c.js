import{_ as i}from"./index-74278c3c.js";import{n as o}from"./texture-7d506f8b.js";import"./three-c85558b8.js";var s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"fileSystem-container"},[n("header-operation"),n("container-operation",{ref:"container"})],1)},_=[];const a=()=>i(()=>import("./headerOperation-1b1f068d.js"),["assets/headerOperation-1b1f068d.js","assets/index-74278c3c.js","assets/texture-7d506f8b.js","assets/three-c85558b8.js","assets/texture-d7471725.css","assets/index-4514b76b.css","assets/headerOperation-98af65b9.css"]),c=()=>i(()=>import("./containerOperation-8c3fa491.js"),["assets/containerOperation-8c3fa491.js","assets/texture-7d506f8b.js","assets/three-c85558b8.js","assets/texture-d7471725.css","assets/index-74278c3c.js","assets/index-4514b76b.css","assets/containerOperation-13ffcb43.css"]),l={components:{headerOperation:a,containerOperation:c},data(){return{visible:!1,confirmFun:()=>{}}},created(){this.$store.commit("templateLibrary/request","")},methods:{open({confirm:e}){this.visible=!0,this.confirmFun=e},confirm(){this.visible=!1,this.confirmFun({files:[].concat(this.$refs.container.selected)}),this.$refs.container.selected=[]}}},r={};var f=o(l,s,_,!1,m,"05735ff5",null,null);function m(e){for(let t in r)this[t]=r[t]}const d=function(){return f.exports}();export{d as default};