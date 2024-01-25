import{n as y,s as u}from"./index-63b3abee.js";import{J as v}from"./jszip.min-3c29ea5e.js";import"./three-2ccf5448.js";var b=function(){var e=this,i=e.$createElement,t=e._self._c||i;return t("div",{staticClass:"headerOperation-container"},[t("div",{staticClass:"operate-history"},[t("vis-icon",{attrs:{code:"#iconbianjiantouzuo"},nativeOn:{click:function(s){return(function(){e.$store.commit("modelLibrary/backOffHistory")}).apply(null,arguments)}}}),t("vis-icon",{attrs:{code:"#iconbianjiantouyou"},nativeOn:{click:function(s){return(function(){e.$store.commit("modelLibrary/forwardHistory")}).apply(null,arguments)}}})],1),t("div",{staticClass:"operate-address"},e._l(e.addressList,function(s,n){return t("span",{key:n,staticClass:"address-sign-box",on:{click:function(f){return e.chouseFile(s)}}},[n>0?t("vis-icon",{style:{transform:"scale(0.6)"},attrs:{code:"#iconsanjiaojiantouyou"}}):e._e(),t("span",{staticClass:"address-title",domProps:{textContent:e._s(s.name)}})],1)}),0),t("div",{staticClass:"operate-operation"},[t("el-popover",{attrs:{placement:"bottom",width:"200",trigger:"click"},model:{value:e.classifyVisible,callback:function(s){e.classifyVisible=s},expression:"classifyVisible"}},[t("el-input",{staticClass:"popover-input",attrs:{size:"mini",placeholder:"输入分类名称"},model:{value:e.classifyName,callback:function(s){e.classifyName=s},expression:"classifyName"}}),t("div",{staticClass:"popover-operation"},[t("el-button",{attrs:{size:"mini",type:"text"},on:{click:e.addClassify}},[e._v(" 确定 ")])],1),t("vis-icon",{directives:[{name:"tooltip",rawName:"v-tooltip.top",value:"新增分类",expression:"'新增分类'",modifiers:{top:!0}},{name:"show",rawName:"v-show",value:e.canAddClassify,expression:"canAddClassify"}],attrs:{slot:"reference",code:"#iconjia1"},slot:"reference"})],1),e.canUpload?t("vis-icon",{directives:[{name:"tooltip",rawName:"v-tooltip.top",value:"上传模型zip压缩包，包含glb/fbx/obj模型文件和preview.png模型预览图片",expression:`
        '上传模型zip压缩包，包含glb/fbx/obj模型文件和preview.png模型预览图片'
      `,modifiers:{top:!0}}],attrs:{code:"#iconshangchuan-fill"},nativeOn:{click:function(s){return e.upload.apply(null,arguments)}}}):e._e(),t("input",{ref:"uploadInput",staticStyle:{display:"none"},attrs:{type:"file",accept:".zip, .tgz"},on:{change:e.fileHandler}})],1)])},g=[];const _={data(){return{classifyName:"",classifyVisible:!1}},computed:{currentFloder(){return this.$store.getters["modelLibrary/currentFloder"]},canUpload(){const e=this.currentFloder.children;return this.currentFloder.parent?e.length&&!e[0].dir?!0:!e.length&&this.currentFloder.url!=="/":!1},canAddClassify(){const e=this.currentFloder.children;return e.length&&e[0].dir?!0:!e.length},addressList(){const e=[this.currentFloder],i=t=>{t.parent&&(e.unshift(t.parent),i(t.parent))};return i(this.currentFloder),e}},methods:{chouseFile(e){e.dir&&this.$store.commit("modelLibrary/currentFloder",e)},upload(){this.$refs.uploadInput.click()},async fileHandler(e){const i=["fbx","glb","obj"],t=["jpg","png","jpeg"],s=e.target.files[0],n=this.currentFloder.id,c=await new v().loadAsync(s);console.log(c);const o=c.files;let a=!1,l=null;for(const r of Object.keys(o))i.includes(this.$tool.getFileExt(r))&&(a=r),t.includes(this.$tool.getFileExt(r))&&(l=r);a||this.$message.warning(`不支持的模型文件格式。支持的模型文件格式：${i.join(", ")}`);const m=await o[a].async("blob");let d=null;l&&(d=`data:image/${this.$tool.getFileExt(l)};base64,`+await o[l].async("base64")),u.uploadModel({classifyId:n,name:a,model:m,ext:this.$tool.getFileExt(a),size:Object.values(o).reduce((r,h)=>r+h._data.uncompressedSize,0),preview:d}).then(r=>{this.$store.commit("modelLibrary/addChildren",r)}).finally(()=>{this.$refs.uploadInput.value=""})},addClassify(){this.classifyName.trim()?u.addClassify({name:this.classifyName.trim(),parentId:this.currentFloder.id}).then(e=>{this.$store.commit("modelLibrary/addChildren",e),this.classifyName="",this.classifyVisible=!1,this.$message.success("添加分类成功！")}).catch(e=>{this.$message.error("数据库有误：modelApi.addClassify"),console.error(e)}):(this.classifyName="",this.classifyVisible=!1)}}},p={};var $=y(_,b,g,!1,x,"16ae6618",null,null);function x(e){for(let i in p)this[i]=p[i]}const j=function(){return $.exports}();export{j as default};