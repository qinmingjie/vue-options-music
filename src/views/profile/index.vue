<template>
  <div class="profile-comp">
    <div :class="['profile-user', responseClass]">
      <img :src="profile.avatarUrl" alt="" class="avatar" />
      <div class="info">
        <div class="nickname">
          <img :src="profile.avatarUrl" alt="" />
          <span>{{ profile.nickname }}</span>
        </div>
        <div class="info-gender-grade">
          <div>
            <span class="grade" v-if="level">LV{{ level }}</span>
            <span class="iconfont icon-male" v-if="profile.gender === 1"></span>
            <span class="iconfont icon-female" v-if="profile.gender === 2"></span>
          </div>
          <el-button type="primary" round @click="loginOut">退出登陆</el-button>
        </div>
        <div class="other">
          <div class="status">
            <div>
              <span>{{ profile.eventCount || 0 }}</span>
              <span class="txt">动态</span>
            </div>
            <div>
              <span>{{ profile.follows || 0 }}</span>
              <span class="txt">关注</span>
            </div>
            <div>
              <span>{{ profile.followeds || 0 }}</span>
              <span class="txt">粉丝</span>
            </div>
          </div>
          <div class="create-time">
            创建时间：<span>{{ getCreateTIme(profile.createTime) }}</span>
          </div>
          <div class="description">
            个人介绍：<span>{{ profile.description || "暂无介绍" }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="playlist">
      <TitleLink :options="titleOptions">
        <span
          v-for="(link, index) in links"
          :key="link.name"
          :class="{ active: index === active }"
          @click="change(index)"
          >{{ link.name }}</span
        >
      </TitleLink>
      <PreviewListCard
        v-show="active === 0"
        :lists="createPlaylist"
        :is-response="true"
        :is-jump="true"
        :icon-position="['80%', '80%']"
        @card-click="jump"
      />
      <PreviewListCard
        v-show="active === 1"
        :lists="collectPlaylist"
        :is-response="true"
        :is-jump="true"
        @card-click="jump"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { formatTimeStamp } from "@/utils/tool";
import { defineAsyncComponent } from "vue";
const TitleLink = defineAsyncComponent(() => import("@/components/title-link/index.vue"));
const PreviewListCard = defineAsyncComponent(() => import("@/components/preview-list-card/index.vue"));
export default {
  name: "ProfileIndex",
  props: {},
  components: {
    TitleLink,
    PreviewListCard
  },
  data() {
    return {
      active: 0,
      links: [{ name: "创建的歌单" }, { name: "收藏的歌单" }],
      titleOptions: { ani: true }
    };
  },
  computed: {
    ...mapState({
      profile: (state) => state.user.info?.profile,
      level: (state) => state.user.info?.level + "",
      createPlaylist: (state) => {
        return state.user.createPlaylist.map((item) => {
          item.picUrl = item.coverImgUrl;
          return item;
        });
      },
      collectPlaylist: (state) => {
        return state.user.collectPlaylist.map((item) => {
          item.picUrl = item.coverImgUrl;
          return item;
        });
      }
    }),
    clientWidth() {
      return this.$clientWidth.value;
    },
    responseClass() {
      if (this.clientWidth <= 500) {
        return "mobile";
      } else if (this.clientWidth <= 1200) {
        return "middle";
      } else {
        return "pc";
      }
    }
  },
  methods: {
    getCreateTIme(time = "") {
      return formatTimeStamp(time);
    },
    change(index) {
      this.active = index;
    },
    jump({ id = "" }) {
      id && this.$router.push(`/playlist-detail/${id}`);
    },
    loginOut() {
      this.$store.dispatch("loginOut");
    }
  },
  created() {},
  mounted() {},
  watch: {}
};
</script>
<style lang="scss" scoped>
.profile-comp {
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
  padding: 2em var(--cm-scrollbar-content-space) 0 var(--cm-scrollbar-padding);
  box-sizing: border-box;
  .profile-user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin-bottom: 4em;
    padding-right: 2em;
    .avatar {
      width: 180px;
      height: 180px;
      object-fit: fill;
      border-radius: 50%;
    }
    .info {
      flex: 0.98;
      .nickname {
        display: inline-block;
        font-weight: bold;
        font-size: 1.5em;
        margin-bottom: 0.5em;
        img {
          display: none;
        }
      }
      .info-gender-grade {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 0.8em;
        margin-bottom: 0.8em;
        border-bottom: 1px solid var(--el-border-color);
        span {
          margin-right: 0.5em;
          &:last-of-type {
            margin-right: 0;
          }
        }
        .grade {
          font-size: 0.7em;
          background-color: #f0f0f0;
          padding: 0.1em 0.8em;
          border-radius: 4em;
        }
        span {
          font-size: 0.9em;
          padding: 0.1em;
          &.icon-male {
            color: #71c2e4;
            background-color: #bff3ff;
            border-radius: 50%;
          }
          &.icon-female {
            color: #f389b8;
            background-color: #ffcce7;
            border-radius: 50%;
          }
        }
      }
      .other {
        .status {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 0.8em;
          div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 0 1.4em;
            position: relative;
            &::before {
              content: "";
              display: block;
              width: 0;
              height: 60%;
              border-right: 1px solid var(--el-border-color);
              position: absolute;
              right: 0;
            }
            &:first-of-type {
              padding-left: 0;
            }
            &:last-of-type {
              padding-right: 0;
              border: none;
              &::before {
                display: none;
              }
            }
            span {
              margin-bottom: 0.1em;
              font-size: 1.2em;
            }
            .txt {
              font-size: 0.6em;
              color: var(--el-text-color-secondary);
              margin-bottom: 0;
            }
          }
        }
        .create-time,
        .description {
          font-size: 0.8em;
          margin-bottom: 0.8em;
          span {
            color: var(--el-text-color-secondary);
          }
        }
        .description {
          margin-bottom: 0;
        }
      }
    }
    &.mobile,
    &.middle {
      .avatar {
        display: none;
      }
      .nickname {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img {
          display: block;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 0.2em;
        }
      }
    }
  }
  .playlist {
    width: 80%;
    margin: 0 auto;
  }
  .title-link-container {
    margin-bottom: 1.5em;
  }
  .el-scrollbar {
    padding-right: var(--cm-scrollbar-padding);
  }
}
@media (max-width: 1200px) {
  .profile-comp {
    .playlist {
      width: 100%;
    }
    .profile-user {
      padding-right: 0;
      .info {
        flex: 1;
      }
    }
  }
}
</style>
