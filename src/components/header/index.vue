<template>
  <el-row align="middle" justify="start" class="header-container">
    <!-- logo -->
    <div class="logo-container">
      <el-row align="middle" @click="$router.push('/')">
        <el-col :span="17" class="logo-flex">
          <i class="logo"></i>
          <span>网易云音乐</span>
        </el-col>
      </el-row>
      <el-row align="middle" class="expand">
        <el-col :span="24" @click="changeExpand">
          <el-icon><IEpExpand /></el-icon>
        </el-col>
      </el-row>
    </div>
    <!-- search -->
    <el-col :span="16" :lg="16" :md="15" :sm="14" :xs="15">
      <SearchComp />
    </el-col>
    <el-col :span="3" :lg="4" :md="5" :sm="7" :xs="10" class="header-right">
      <Profile />
    </el-col>
  </el-row>
</template>

<script>
import SearchComp from "./search.vue";
import Profile from "./profile.vue";
export default {
  name: "HeaderComp",
  components: {
    SearchComp,
    Profile
  },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  created() {},
  computed: {},
  methods: {
    changeExpand() {
      this.$emit("update:modelValue", true);
    }
  }
};
</script>

<style scoped lang="scss">
.header-container {
  position: relative;
  height: 100%;
  color: var(--cm-header-text-color);
  .logo-container {
    width: 180px;
    .logo-flex {
      cursor: pointer;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 10px;
    }
    .logo {
      display: block;
      width: 24px;
      height: 24px;
      background-color: pink;
      border-radius: 50%;
      margin-right: 10px;
    }
    .expand {
      display: none;
      cursor: pointer;
    }
  }
  .header-right {
    position: absolute;
    height: 100%;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
@media (max-width: 1200px) {
  .header-container {
    .logo-container {
      max-width: 50px;
      .logo-flex {
        display: none;
      }
      .expand {
        display: block;
      }
    }
  }
}
</style>
