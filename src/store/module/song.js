import { getPlaylistDetail } from "@/api/song";
export default {
  state: {
    previewPlaylistDetail: null, // 预览的歌单信息
    playlist: [], // 播放列表缓存
    currentId: "" // 当前播放的音乐id
  },
  mutations: {
    setPreviewPlaylistDetail(state, data = null) {
      state.previewPlaylistDetail = data;
    },
    setPlaylist(state, list = []) {
      state.playlist = list;
    },
    setCurrentId(state, id = "") {
      state.currentId = id;
    }
  },
  actions: {
    // 获取歌单详情信息
    async playlistDetail({ commit }, id) {
      // 每次获取新的歌单前将store中的旧的歌单信息先置空
      commit("setPreviewPlaylistDetail", null);
      try {
        const res = await getPlaylistDetail({ id });
        const { playlist = null } = res?.data || {};
        commit("setPreviewPlaylistDetail", playlist);
      } catch (error) {
        console.error(error);
      }
    },
    // 播放
    async play({ commit }, { lists = [], id = "" }) {
      // 设置当前的播放列表
      commit("setPlaylist", lists);
      // 当前是单曲播放还是全部播放
      lists.length && commit("setCurrentId", id || lists.slice(0, 1)[0]?.id);
    }
  },
  getters: {
    // 预览的歌单相关getters供playlist-list-card组件使用
    previewId(state) {
      return state.previewPlaylistDetail?.id;
    },
    previewTotal(state) {
      return state.previewPlaylistDetail?.trackCount || 0;
    },
    previewTracks(state) {
      return state.previewPlaylistDetail?.tracks || [];
    },
    // 当前的歌曲信息供footer展示
    currentMusic(state) {
      return state.playlist.filter((item) => item.id === state.currentId);
    }
  }
};
