<template>
  <!-- 响应式卡片列表 -->
  <div class="preview-list-card-comp">
    <div class="preview-list-card-wrap">
      <PreviewCard
        v-for="list in lists"
        :key="list.id"
        :info="list"
        :path="baseSkipPath + list.id"
        :class="cardColumnClass"
      />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
const PreviewCard = defineAsyncComponent(() => import("@/components/preview-card/index.vue"));
export default {
  name: "PreviewListCard",
  props: {
    lists: {
      type: Array
    },
    baseSkipPath: {
      type: String,
      default: "/playlist-detail/"
    },
    disabled: {
      type: Boolean,
      default: true
    }
  },
  components: { PreviewCard },
  data() {
    return {
      columnName: "column5"
    };
  },
  computed: {
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
    }
  },
  methods: {},
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
    width: 46%;
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
</style>
