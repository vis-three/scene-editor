import{t as i}from"./configurationTranslater-333f12c8.js";import{n as c}from"./index-2dfd5781.js";import"./three-c85558b8.js";var l=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"ShaderMaterial-container"},[e.config.shader?e._e():n("el-button",{attrs:{size:"mini",type:"primary"},on:{click:e.openShaderLibrary}},[e._v(" 选择作色器 ")]),e.config.shader?n("de-collapse-layout",{attrs:{label:"参数设置",icon:"#iconshezhi",arrowPosition:"left"},scopedSlots:e._u([{key:"container",fn:function(){return e._l(e.controllers,function(r,a){return n(r.component,e._b({key:a,tag:"component",attrs:{slot:"container",label:r.label,keyframe:!0,animation:{target:e.config,attribute:`uniforms.${r.key}.value`}},slot:"container",model:{value:e.config.uniforms[r.key].value,callback:function(s){e.$set(e.config.uniforms[r.key],"value",s)},expression:"config.uniforms[item.key].value"}},"component",r.props,!1))})},proxy:!0}],null,!1,3381442726)}):e._e()],1)},u=[];const f={props:{config:{type:Object,required:!0}},computed:{configuration(){return this.config.shader?this.$store.getters["shader/configuration"][this.config.vid]:null},controllers(){return this.config.shader?i(this.configuration):null},textureList(){const e=[{name:"无",vid:""}],t=this.$store.getters["texture/get"];return Object.keys(t).forEach(n=>{e.push({vid:n,name:t[n].name})}),e}}},o={};var _=c(f,l,u,!1,p,"71012070",null,null);function p(e){for(let t in o)this[t]=o[t]}const g=function(){return _.exports}();export{g as default};