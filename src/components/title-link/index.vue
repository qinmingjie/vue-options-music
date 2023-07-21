<template>
  <div
    :class="{ 'title-link-container': true, 'no-cursor': options.hidCursor }"
    :style="{ justifyContent: options.justify }"
  >
    <div :class="{ 'title-links': true, ani: options.ani, 'text-bold': options.isBold }">
      <slot name="default">
        <template v-if="links.length">
          <span v-for="link in links" :key="link.path" @click="jump(link.path)">{{ link.name }}</span>
        </template>
      </slot>
    </div>
    <div class="title-link-icon" v-show="options.isShowIcon" @click="jump(link.path)">
      <slot name="icon">
        <el-icon><IEpArrowRight /></el-icon>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TitleLInkIndex",
  props: {
    links: {
      type: Array
    },
    options: {
      type: Object,
      default(rawProps) {
        return Object.assign(
          {
            isShowIcon: false,
            justify: "flex-start",
            ani: false,
            isBold: false,
            hidCursor: false
          },
          rawProps || {}
        );
      }
    }
  },
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    jump(path) {
      path && this.$router.push(path);
    }
  },
  created() {},
  mounted() {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.title-link-container {
  display: flex;
  align-items: flex-end;
  margin-bottom: 1.2em;
  font-size: 1.2em;
  &.no-cursor {
    span {
      cursor: auto;
    }
    .title-links {
      ::v-deep span {
        cursor: initial;
      }
    }
  }
  span {
    cursor: pointer;
  }
  .title-links {
    ::v-deep span {
      position: relative;
      cursor: pointer;
      margin-right: 20px;
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
  .title-links.ani {
    ::v-deep span {
      &.active {
        font-weight: bold;
        padding-bottom: 4px;
        &::after {
          display: block;
          content: "";
          width: 80%;
          height: 3px;
          background-color: $color-primary;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
  .title-links.text-bold {
    font-weight: bold;
  }
  .title-link-icon {
    align-self: center;
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    .el-icon {
      position: relative;
      top: 1px;
    }
  }
}
</style>
