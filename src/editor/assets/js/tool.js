import { MessageBox, Message } from "element-ui";
export default {
  getFileExt(str) {
    const list = str.split(".");
    return list.length ? list.pop().toLowerCase() : "";
  },

  async fileToBlob(file) {
    const reader = new FileReader();
    return await new Promise((resolve, reject) => {
      reader.onload = (e) => {
        let blob;
        if (typeof e.target.result === "object") {
          blob = new Blob([e.target.result]);
        } else {
          blob = e.target.result;
        }
        resolve(blob);
      };

      reader.onerror = (error) => reject(error);

      reader.readAsArrayBuffer(file);
    });
  },

  async zipFileToBlob(file) {
    const list = file.name.split(".");
    const ext = list.length ? list.pop().toLowerCase() : "";
    return `data:image/${ext};base64,` + (await file.async("base64"));
  },

  async blobToImage(blob, ext) {
    const reader = new FileReader();
    return await new Promise((resolve, reject) => {
      reader.onload = (e) => {
        resolve(`data:image/${ext};base64,` + resolve.result);
      };

      reader.onerror = (error) => reject(error);

      reader.readAsDataURL(blob);
    });
  },

  dataURLToBlob(dataURL) {
    var arr = dataURL.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  },

  safeTips() {
    return new Promise((resolve, reject) => {
      MessageBox.confirm(
        `<p>上传并使用不明来源的包含脚本文件可能会造成以下问题，请做好甄别与选择。</p>
        <ul>
          <li>1. 项目数据盗取。（包含模型等资源文件，场景脚本等数据）</li>
          <li>2. 项目数据损坏或污染。（包含模型等资源文件，场景脚本等数据）</li>
          <li>3. 操作监听或数据监听等监听器植入。</li>
          <li>4. 功能破坏，破坏某些运行期功能。</li>
        </ul>`,
        "安全提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
        },
      )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  devTips() {
    Message.info("功能正在开发中...");
    return;
  },

  async parseNpmFiles(files) {
    if (!files["package.json"]) {
      throw Error("上传失败！找不到配置文件：package.json");
    }

    const pkg = JSON.parse(await files["package.json"].async("string"));

    let indexPath = pkg.module || pkg.main;

    if (!indexPath) {
      throw Error("上传失败！无法从package.json中获取有效的入口路径。");
    }

    if (indexPath.startsWith("/")) {
      indexPath = indexPath.slice(1);
    } else if (indexPath.startsWith("./")) {
      indexPath = indexPath.slice(2);
    }

    if (!files[indexPath]) {
      throw Error("上传失败！无法根据package.json的相关字段获取入口文件。");
    }

    let scriptFile = files[indexPath];
    scriptFile = await scriptFile.async("string");
    scriptFile = new Blob([scriptFile], { type: "application/javascript" });

    const previewExt = ["jpg", "png", "jpeg"];
    let preview = undefined;

    for (const ext of previewExt) {
      if (files[`preview.${ext}`]) {
        preview =
          `data:image/${ext};base64,` +
          (await files[`preview.${ext}`].async("base64"));
      }
    }

    return {
      scriptFile,
      pkg,
      preview,
      size: Object.values(files).reduce((total, item) => {
        return item.dir ? total : total + item._data.uncompressedSize;
      }, 0),
    };
  },

  filesListToTree(files) {
    const resources = {};

    Object.values(files).forEach((file) => {
      const path = file.name.split("/");
      if (path.length === 1) {
        resources[file.name] = file;
      } else {
        const lastName = path.pop();
        let root = resources;
        for (const name of path) {
          if (!root[name]) {
            root[name] = {};
          }
          root = root[name];
        }

        if (lastName) {
          if (file.dir) {
            root[lastName] = {};
          } else {
            root[lastName] = file;
          }
        }
      }
    });

    return resources;
  },

  fileTreeToList(fileTree) {
    const files = {};

    const recursion = (object) => {
      Object.values(object).forEach((item) => {
        if (item.date) {
          files[item.name] = item;
        } else if (typeof item === "object") {
          recursion(item);
        }
      });
    };

    recursion(fileTree);
    return files;
  },

  reduceFileListFolder(files) {
    const nameList = Object.keys(files);

    let shortest = { length: Infinity };

    for (const name of nameList) {
      const paths = name.split("/");
      paths.pop();

      if (paths.length < shortest.length) {
        shortest = paths;
      }
    }

    if (shortest.length && shortest.length !== Infinity) {
      const newFiles = {};
      shortest = shortest.join("/") + "/";

      for (const file of Object.values(files)) {
        file.name = file.name.slice(shortest.length);
        newFiles[file.name] = file;
      }

      return newFiles;
    } else {
      return files;
    }
  },
};
