const cacheManager = new Map();

window.addEventListener("beforeunload", () => {
  cacheManager.clear();
});

export default cacheManager;
