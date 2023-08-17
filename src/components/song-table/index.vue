<template>
  <div v-loading="loading" class="song-table-comp">
    <template v-if="tableData.length">
      <el-table :show-header="showHeader" :stripe="stripe" :data="tableData">
        <slot>
          <el-table-column type="index" v-if="showIndex" width="65">
            <template #default="{ $index }">
              <div class="default-cell">
                <slot name="index" :index="handleIndex(handleIndex)">{{ handleIndex($index) }}</slot>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-for="headerItem in headerOptions"
            :key="headerItem.label"
            :label="headerItem.label"
            :prop="headerItem.prop"
            :border="false"
            :width="headerItem.width"
          >
            <template #default="{ row }">
              <div class="default-cell">
                <slot :name="headerItem.slotName" :row="row">
                  {{ row[headerItem.prop] }}
                </slot>
              </div>
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
  computed: {
    handleIndex() {
      return (index) => {
        return index < 9 ? `0${index + 1}` : index + 1;
      };
    }
  },
  methods: {},
  watch: {}
};
</script>

<style scoped lang="scss">
.default-cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
  background-color: var(--el-table-tr-bg-color);
}
:deep(.el-table tr) {
  background-color: var(--el-fill-color-lighter);
  &:hover {
    cursor: pointer;
  }
}
:deep(.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell) {
  background-color: var(--el-table-row-hover-bg-color);
}
:deep(.el-table td.el-table__cell) {
  border-bottom: 0;
}
:deep(.el-table__inner-wrapper::before) {
  background-color: transparent;
}
</style>
