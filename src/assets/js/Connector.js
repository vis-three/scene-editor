class Connector {
  constructor() {}

  apply(target, params) {
    params.forEach((elem) => {
      if (target[elem] !== undefined) {
        if (typeof target[elem] === "function") {
          Object.defineProperty(this, elem, {
            value: target[elem].bind(target),
            configrable: false,
          });
        } else {
          Object.defineProperty(this, elem, {
            value: target[elem],
            configrable: false,
          });
        }
      }
    });
    return this;
  }
}

export default Connector;
