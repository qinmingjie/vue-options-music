<template>
  <div>
    <el-row align="middle" justify="start">
      <el-col :span="4" :lg="2" :md="3" class="history-icon">
        <el-icon class="prev"><IEpArrowLeft /></el-icon>
        <el-icon class="next"><IEpArrowRight /></el-icon>
      </el-col>
      <el-col :span="12" :lg="6" :md="8" :xs="20">
        <el-input v-model.trim="keywords" class="w-50 m-2" placeholder="Type something" style="width: 100%" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "SearchComp",
  components: {},
  data() {
    return {
      keywords: ""
    };
  },
  created() {},
  methods: {},
  watch: {}
};
</script>

<style scoped lang="scss">
.popover-scroll {
}
.history-icon {
  margin-right: 5px;

  .prev,
  .next {
    width: 24px;
    height: 24px;
    font-size: 14px;
    background-color: var(--cm-opacity-bg-color);
    border-radius: 50%;
    cursor: pointer;
  }
  .prev {
    margin-right: 8px;
  }
}

:deep(.el-input__wrapper) {
  border-radius: 50px;
  background-color: var(--cm-opacity-bg-color);
  box-shadow: none;
  &:hover {
    box-shadow: none;
  }
  input {
    outline-style: none;
    color: #fff;
    &::-webkit-input-placeholder {
      color: var(--cm-placeholder-color);
    }
  }
}
.hot-conainer {
  .title {
    line-height: 30px;
    padding: 10px 15px 0px 15px;
  }
  .hot-item {
    height: 56px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 15px;
    cursor: pointer;
    &:hover {
      background-color: var(--el-fill-color-light);
    }
    .hot-item-left {
      margin-right: 10px;
      width: 20px;
      &.primary {
        color: $color-primary;
      }
    }
    .hot-item-right {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hir-top {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .name {
      font-weight: bold;
      margin-right: 5px;
    }
    img {
      display: block;
      margin: 0 5px;
    }
    .hir-icon {
      width: 25px;
    }
    .score-icon {
      width: 10px;
    }
    .score,
    .info {
      font-size: 0.7em;
      color: var(--el-text-color-placeholder);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.suggest-container {
  padding-bottom: 20px;
  box-sizing: border-box;
  .suggest-title {
    color: var(--el-text-color-placeholder);
    padding-left: 15px;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
  }
  .suggest-item {
    height: 30px;
    line-height: 30px;
    padding: 0 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    &:hover {
      background-color: var(--el-fill-color-light);
    }
  }
}
@media (max-width: 1200px) {
  .history-icon {
    display: none;
  }
}
</style>
