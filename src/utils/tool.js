const expires = import.meta.env.VITE_EXPIRES;

class StorageActions {
  getStorage(name) {
    let data = localStorage.getItem(name);
    try {
      data = JSON.parse(data);
    } catch (error) {
      data = null;
    }
    return data;
  }

  setStorage(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
  }

  removeStorage(name) {
    localStorage.removeItem(name);
  }

  clearStorage() {
    localStorage.clear();
  }
}
export const storageAction = new StorageActions();

// 自定义setinterval
export function customInterval(callback, delay) {
  let timeId;
  function interval() {
    callback.call(this);
    timeId = setTimeout(interval, delay);
  }

  timeId = setTimeout(interval, delay);

  return () => {
    clearTimeout(timeId);
  };
}

// 查看用户是否登陆
export function getStatus() {
  const token = storageAction.getStorage("TOKEN");
  const createTime = storageAction.getStorage("CREATE_TIME");
  const timeDifference = new Date().getTime() - createTime;
  let loginStatus = false;
  if (token && timeDifference < expires) {
    loginStatus = true;
  } else {
    storageAction.clearStorage();
  }
  return loginStatus;
}

export function hasPermission(item, roles) {
  if (item.meta && item.meta.roles && roles.length) {
    return roles.some((role) => item.meta.roles.includes(role));
  }
  return false;
}

export function generatorRouters(asyncRoutes, roles) {
  const routes = [];
  asyncRoutes.forEach((item) => {
    if (hasPermission(item, roles)) {
      const route = {
        path: item.path,
        name: item.name,
        component: item.component,
        meta: item.meta
      };
      if (item.children) {
        route.children = generatorRouters(item.children, roles);
      }
      routes.push(route);
    }
  });
  return routes;
}

export function debouce(fn, delay) {
  let timer = null;
  return function () {
    const _this = this;
    const _args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.call(_this, _args);
    }, delay);
  };
}

export function throttle(fn, delay) {
  let timer = null;
  return function () {
    const _this = this;
    const _args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        fn.call(_this, _args);
        timer = null;
      }, delay);
    }
  };
}

export function formatPlayCount(num) {
  const tenThousand = Math.pow(10, 4);
  let result = "";
  if (!num) return result;
  if (num < tenThousand) {
    result = num;
  } else if (num >= tenThousand && num < tenThousand * tenThousand - 1 && num % tenThousand < tenThousand) {
    result = `${Math.round(num / tenThousand)}万`;
  } else {
    result = `${Math.round(num / (tenThousand * tenThousand))}亿`;
  }
  return result;
}

export function chunkArray(arr = [], size = 0) {
  if (!Array.isArray(arr)) return;
  let newArr = [];
  let chunk = [];
  let n = 0;
  arr.forEach((item, index) => {
    index++;
    chunk.push(item);
    if (index % size === 0) {
      newArr.push(chunk);
      chunk = [];
      n++;
    }
  });
  if (n * size !== arr.length) {
    newArr.push(chunk);
  }
  return newArr;
}

export function getAppointAttr(obj, keys = []) {
  const objKeys = obj && Object.keys(obj);
  const result = {};
  if (!obj || !objKeys.length || !keys.length) return null;
  keys.forEach((key) => {
    objKeys.some((item) => item === key) && (result[key] = obj[key]);
  });
  return Object.keys(result) && result;
}

export function formatTimeStamp(timeStamp) {
  if (!timeStamp) return;
  const date = new Date(timeStamp);
  const regx = /(\/|\\)/g;
  const strTime = Intl.DateTimeFormat("zh-Hans", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  return strTime.replace(regx, "-");
}
