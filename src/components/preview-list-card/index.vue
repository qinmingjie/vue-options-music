<template>
  <!-- 响应式卡片列表 -->
  <div class="preview-list-card-comp">
    <div class="preview-list-card-wrap" v-if="lists.length">
      <!-- 音乐卡片 -->
      <div :class="['preview-item', isResponse ? cardColumnClass : '']" v-for="list in lists" :key="list.id">
        <div :class="{ 'preview-img': true, 'hiden-cursor': !isJump }">
          <el-image :src="list.picUrl + '?param=400y400'" loading="lazy">
            <template #placeholder>
              <div class="image-place-slot"><img src="../../assets/img-place.png" /></div>
            </template>
            <template #error>
              <div class="image-error-slot"><img src="../../assets/img-failed.png" /></div>
            </template>
          </el-image>
          <span
            class="play"
            v-if="isShow('playIcon')"
            :style="{ left: iconPosition[0], top: iconPosition[1] }"
            @click="play(list.id)"
          >
            <i class="iconfont icon-play"></i>
          </span>
          <span class="play-count" v-if="isShow('playCount')">{{ playCount(list.playcount || list.playCount) }}</span>
          <span class="mask" v-if="isShow('mask')"></span>
          <span class="to-jump" @click="jump(list)"></span>
        </div>
        <p :class="{ name: true, 'hiden-cursor': !isJump }" v-if="isShow('name')" @click="jump(list)">
          {{ list.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { formatPlayCount } from "@/utils/tool";
import { mapGetters } from "vuex";
export default {
  name: "PreviewListCard",
  props: {
    // 卡片数据
    lists: {
      type: Array
    },
    // 卡片展示的内容
    show: {
      type: Array,
      default() {
        return ["name", "playIcon", "playCount", "mask"];
      }
    },
    // 播放按钮的定位
    iconPosition: {
      type: Array,
      default() {
        return ["76%", "76%"];
      }
    },
    // 卡片是否响应式布局
    isResponse: {
      type: Boolean,
      default: false
    },
    // 点击是否跳转
    isJump: {
      type: Boolean,
      default: true
    }
  },
  components: {},
  data() {
    return {
      columnName: "column5"
    };
  },
  computed: {
    ...mapGetters({
      previewId: "previewId",
      previewTracks: "previewTracks"
    }),
    clientWidth() {
      return this.$clientWidth.value;
    },
    cardColumnClass() {
      const classMap = {
        column2: "column2",
        column4: "column4",
        column5: "column5"
      };
      return classMap[this.columnName];
    },
    isShow() {
      return (type) => {
        return this.show.some((item) => item === type);
      };
    }
  },
  methods: {
    jump(params) {
      this.isJump && this.$emit("cardClick", params);
    },
    playCount(count) {
      return formatPlayCount(count);
    },
    async play(playlistId) {
      if (this.previewId !== playlistId) {
        await this.$store.dispatch("playlistDetail", playlistId);
      }
      await this.$store.dispatch("play", { lists: this.previewTracks });
    }
  },
  created() {},
  mounted() {},
  watch: {
    clientWidth: {
      handler(val) {
        if (val <= 500) {
          this.columnName = "column2";
        } else if (val <= 1200) {
          this.columnName = "column4";
        } else {
          this.columnName = "column5";
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.preview-list-card-wrap {
  display: flex;
  flex-wrap: wrap;

  .column2 {
    width: 48%;
    margin-right: 4%;
    &:nth-of-type(2n) {
      margin-right: 0;
    }
  }
  .column4 {
    width: 22%;
    margin-right: 4%;
    &:nth-of-type(4n) {
      margin-right: 0;
    }
  }
  .column5 {
    width: 18%;
    margin-right: 2.5%;
    &:nth-of-type(5n) {
      margin-right: 0;
    }
  }
}

.preview-item {
  width: 100%;
  .preview-img {
    width: 100%;
    border-radius: 10px;
    position: relative;
    margin-bottom: 10px;
    cursor: pointer;
    .play-count {
      position: absolute;
      z-index: 3;
      color: rgba(255, 255, 255, 0.9);
      right: 10px;
      top: 4px;
      font-size: 0.8em;
    }
    .to-jump {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
    }
    .mask {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      border-radius: 10px;
      background-color: rgba(0, 0, 0, 0.2);
      opacity: 0;
      transition: all 0.6s;
    }
    &:hover {
      .mask,
      .play {
        opacity: 1;
      }
    }
    &.hiden-cursor {
      cursor: initial;
    }
  }
  .el-image {
    border-radius: 10px;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2);
    display: block;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    :deep(img) {
      display: block;
      width: 100%;
      height: auto;
    }
  }
  .play {
    display: flex;
    padding: 4%;
    justify-content: center;
    align-items: center;
    z-index: 3;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.9);
    position: absolute;
    color: $color-primary;
    text-align: center;
    transition: all 0.6s;
    opacity: 0;
    .icon-play {
      font-size: 1em;
    }
  }
  .name {
    margin-top: 0;
    font-size: 0.9em;
    opacity: 0.9;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 1.2em;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
    &.hiden-cursor {
      cursor: initial;
    }
  }
}
</style>
