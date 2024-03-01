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

  async dataURLToBlob(dataURL) {
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
};
