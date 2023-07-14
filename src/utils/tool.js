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

export const storageAction = new StorageActions();
