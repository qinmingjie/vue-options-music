<template>
  <div class="preview-item">
    <div class="preview-img" ref="previewImg">
      <el-image :src="info.picUrl" loading="lazy" fit="scale-down">
        <template #placeholder>
          <div class="image-place-slot"><img src="../../assets/img-place.png" /></div>
        </template>
        <template #error>
          <div class="image-error-slot"><img src="../../assets/img-failed.png" /></div>
        </template>
      </el-image>
      <span class="play" v-if="isShow('playIcon')">
        <el-icon :style="{ left: iconPosition[0], top: iconPosition[1] }"><IEpCaretRight /></el-icon>
      </span>
      <span class="play-count" v-if="isShow('playCount')">{{ playCount }}</span>
      <span class="mask" v-if="isShow('mask')"></span>
      <span class="to-jump" @click="jump(path)"></span>
    </div>
    <p class="name" v-if="isShow('name')" @click="jump(path)">{{ info.name }}</p>
  </div>
</template>

<script>
import { formatPlayCount } from "@/utils/tool";
export default {
  name: "PreiewItem",
  props: {
    info: {
      type: Object,
      required: true,
      default() {
        return {};
      }
    },
    show: {
      type: Array,
      default() {
        return ["name", "playIcon", "playCount", "mask"];
      }
    },
    iconPosition: {
      type: Array,
      default() {
        return ["76%", "76%"];
      }
    },
    path: {
      type: String
    }
  },
  components: {},
  data() {
    return {};
  },
  computed: {
    playCount() {
      return formatPlayCount(this.info.playcount || this.info.playCount);
    },
    isShow() {
      return (type) => {
        return this.show.some((item) => item === type);
      };
    }
  },
  methods: {
    jump(path) {
      path && this.$router.push(path);
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang="scss" scoped>
.preview-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .preview-img {
    flex: 1;
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
      width: 100%;
      height: 100%;
      z-index: 1;
      border-radius: 10px;
      background-color: rgba(0, 0, 0, 0.2);
      opacity: 0;
      transition: all 0.6s;
    }
    &:hover {
      .mask,
      .play .el-icon {
        opacity: 1;
      }
    }
  }
  .el-image {
    border-radius: 10px;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2);
    display: block;
    width: 100%;
    .image-error-slot img,
    .image-place-slot img {
      width: 100%;
      display: block;
    }
  }
  .play {
    .el-icon {
      width: 13%;
      height: 13%;
      display: flex;
      justify-content: center;
      align-self: center;
      z-index: 3;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.9);
      position: absolute;
      color: $color-primary;
      text-align: center;
      transition: all 0.6s;
      opacity: 0;
      svg {
        font-size: 1.2em;
      }
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
  }
}
</style>
