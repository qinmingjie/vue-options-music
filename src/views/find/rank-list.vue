<template>
  <div class="rank-list-container" v-loading="loading">
    <template v-if="mainList.length">
      <el-row>
        <el-col :xs="0" :sm="0" :md="24" :lg="24">
          <LinksComp :links="[{ name: '官方榜' }]" :options="{ ani: false, hidCursor: true, isBold: true }" />
        </el-col>
      </el-row>
      <!-- 官方主推榜单 -->
      <div v-for="main in mainList" :key="main.id">
        <template v-if="main.tracks">
          <el-row justify="space-between" class="main-toplist">
            <el-col :xs="0" :sm="0" :md="3" :lg="3">
              <PreviewItem :info="main" :show="['playIcon', 'playCount', 'mask']" :iconPosition="['42%', '42%']" />
            </el-col>
            <el-col :xs="24" :sm="24" :md="20" :lg="20">
              <!-- 小于1200显示 -->
              <el-row justify="space-between" align="middle">
                <el-col :xs="12" :sm="12" :md="0" :lg="0">
                  <LinksComp :links="[{ name: main.name }]" :options="{ isBold: true }" />
                </el-col>
                <el-col :xs="12" :sm="12" :md="0" :lg="0">
                  <div class="read-more">
                    <LinksComp
                      :links="[{ name: '查看更多', path: '' }]"
                      :options="{ justify: 'flex-end', isShowIcon: true }"
                    />
                  </div>
                </el-col>
              </el-row>
              <template v-if="main.tracks">
                <SongTable
                  :table-data="main.tracks"
                  :header-options="tableHeader"
                  :show-header="false"
                  :playlist-id="main.id"
                >
                  <template #song-artist="{ row }">
                    <div class="song-ar">{{ handlerArtis(row.ar) }}</div>
                  </template>
                  <template #song-name="{ row }">
                    <div class="song-name">{{ row.name }}</div>
                  </template>
                </SongTable>
              </template>
              <!-- 大于1200展示 -->
              <el-row>
                <el-col :xs="0" :sm="0" :md="24" :lg="24">
                  <div class="read-more">
                    <LinksComp :links="[{ name: '查看更多', path: '' }]" :options="{ isShowIcon: true }" />
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </div>
    </template>
    <!-- 全球榜单 -->
    <template v-if="otherList.length">
      <el-row>
        <el-col :xs="0" :sm="0" :md="24" :lg="24">
          <LinksComp :links="['全球榜']" :link-type="'static-title'" />
        </el-col>
      </el-row>
      <el-row v-for="(other, index) in handlerList" :key="index">
        <el-col :span="listSpan" v-for="(item, index) in other" :key="item.id" :offset="index > 0 ? listOffset : 0">
          <PreviewItem :info="item" :iconPosition="['42%', '42%']" :key="index" />
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script>
import LinksComp from "@/components/title-link/index.vue";
import PreviewItem from "@/components/preview-item/index.vue";
import SongTable from "@/components/song-table/index.vue";
import { getToplist, getPlaylistDetail } from "@/api/song";
import { chunkArray } from "@/utils/tool";
export default {
  name: "RankList",
  components: { LinksComp, SongTable, PreviewItem },
  data() {
    return {
      mainList: [],
      otherList: [],
      loading: false,
      listSpan: 4,
      listOffset: 1,
      tableHeader: [
        {
          slotName: "song-name",
          label: "歌曲名称",
          prop: "name"
        },
        {
          slotName: "song-artist",
          label: "歌手",
          prop: "ar"
        }
      ]
    };
  },
  computed: {
    handlerArtis() {
      return (artists) => {
        return artists && artists.map((item) => item.name).join("/");
      };
    },
    clientWidth() {
      return this.$clientWidth.value;
    },
    handlerList() {
      return this.clientWidth <= 500 ? chunkArray(this.otherList, 2) : chunkArray(this.otherList, 5);
    }
  },
  async created() {
    try {
      this.loading = true;
      await this.getToplist();
      await this.getMainListPreviewSong();
    } catch (error) {
      console.error(error);
    }
    this.loading = false;
  },
  mounted() {},
  methods: {
    async getToplist() {
      const res = await getToplist();
      const toReserve = ["id", "name", "description", "coverImgUrl", "updateTime", "ToplistType"];
      let { list = [] } = res?.data || {};
      // 格式化数据
      await list
        .map((item) => {
          return Object.keys(item)
            .filter((key) => toReserve.includes(key))
            .reduce((obj, key) => {
              return { ...obj, [key]: item[key], picUrl: item.coverImgUrl };
            }, {});
        })
        .forEach((item) => {
          item.ToplistType && this.mainList.push(item);
          !item.ToplistType && this.otherList.push(item);
        });
    },
    async getMainListPreviewSong() {
      await this.mainList.map(async (item) => {
        const res = await getPlaylistDetail({ id: item.id });
        const { tracks = [] } = res.data?.playlist || {};
        item.tracks = tracks.slice(0, 5);
        return item;
      });
    }
  },
  watch: {
    clientWidth: {
      handler(val) {
        if (val <= 500) {
          (this.listSpan = 10), (this.listOffset = 4);
          this.tableHeader = [
            {
              slotName: "song-name",
              label: "歌曲名称",
              prop: "name"
            }
          ];
          return;
        }

        this.listSpan = 4;
        this.listOffset = 1;
      },
      immediate: true
    }
  }
};
</script>

<style scoped lang="scss">
.rank-list-container {
  height: 100%;
}
.main-toplist {
  margin-bottom: 2em;
  .title-link-container {
    margin-bottom: 0;
  }
}
.read-more .title-link-container {
  padding-top: 0.5em;
  font-size: 0.8em;
  opacity: 0.5;
  margin-bottom: 0;
}
.song-name {
  color: var(--el-text-color-primary);
  font-weight: bold;
}
.song-ar {
  text-align: right;
}
.song-name,
.song-ar {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media (max-width: 1200px) {
  .main-toplist {
    .title-link-container {
      margin-bottom: 0.5em;
    }
  }
}
</style>
