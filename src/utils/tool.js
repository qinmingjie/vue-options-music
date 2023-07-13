export const storageActions = {
  get(name) {
    let data = localStorage.getItem(name);
    try {
      data = JSON.parse(data);
    } catch (err) {
      throw err.message;
    }
    return data;
  },
  set({ data, name }) {
    data = JSON.stringify(data);
    localStorage.setItem(name, data);
    return data;
  },
  remove(name) {
    localStorage.removeItem(name);
  },
  clear() {
    localStorage.clear();
  }
};
