import { getPlaylistDetail } from "@/api/song";
export default {
  state: {
    previewPlaylistDetail: null // 预览的歌单信息
  },
  mutations: {
    setPreviewPlaylistDetail(state, data = null) {
      state.previewPlaylistDetail = data;
    }
  },
  actions: {
    // 获取歌单详情信息
    async playlistDetail({ commit }, id) {
      try {
        const res = await getPlaylistDetail({ id });
        const { playlist = {} } = res?.data || {};
        commit("setPreviewPlaylistDetail", playlist);
      } catch (error) {
        console.error(error);
      }
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
    }
  }
};
