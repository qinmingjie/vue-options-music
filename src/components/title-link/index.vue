<template>
  <div class="title-link-container" :style="{ justifyContent: justify }">
    <div :class="{ 'title-links': true, ani }">
      <slot name="default" :options="options">
        <template v-if="links.length">
          <span v-for="link in links" :key="link.path">{{ link.name }}</span>
        </template>
      </slot>
    </div>
    <div class="title-link-icon" v-show="isShowIcon">
      <slot name="icon"></slot>
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
    isShowIcon: {
      type: Boolean,
      default: false
    },
    justify: {
      type: String,
      default: "flex-start"
    },
    ani: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      options: { name: "hmm", age: 12 }
    };
  },
  computed: {},
  methods: {},
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
  span {
    cursor: pointer;
  }
  .title-links {
    ::v-deep span {
      position: relative;
      margin-right: 20px;
      cursor: pointer;
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
  .title-links.ani {
    ::v-deep span {
      &.active {
        font-size: 1.2em;
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
}
</style>
