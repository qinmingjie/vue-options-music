<template>
  <div v-loading="loading">
    <template v-if="tableData.length">
      <el-table :show-header="showHeader" :stripe="stripe" :data="tableData">
        <slot>
          <el-table-column type="index" v-if="showIndex" />
          <el-table-column
            v-for="headerItem in headerOptions"
            :key="headerItem.label"
            :label="headerItem.label"
            :prop="headerItem.prop"
            :border="false"
          >
            <template #default="{ row }">
              <slot :name="headerItem.slotName" :row="row">
                {{ row[headerItem.prop] }}
              </slot>
            </template>
          </el-table-column>
        </slot>
      </el-table>
    </template>
  </div>
</template>

<script>
export default {
  name: "songTable",
  components: {},
  props: {
    // 表头配置
    headerOptions: {
      type: Array,
      required: true,
      default: () => []
    },
    // 表格数据
    tableData: {
      type: Array,
      default: () => []
    },
    // 歌单id
    playlistId: {
      type: Number
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    stripe: {
      type: Boolean,
      default: true
    },
    showIndex: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {},
  watch: {}
};
</script>

<style scoped lang="scss">
::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
  background-color: var(--el-table-tr-bg-color);
}
::v-deep .el-table tr {
  background-color: var(--el-fill-color-lighter);
  &:hover {
    cursor: pointer;
  }
}
::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background-color: var(--el-table-row-hover-bg-color);
}
::v-deep .el-table td.el-table__cell {
  border-bottom: 0;
}
::v-deep .el-table__inner-wrapper::before {
  background-color: transparent;
}
</style>
