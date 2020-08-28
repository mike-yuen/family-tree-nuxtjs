<template>
  <header
    id="header"
    class="header"
    :class="{ header__collapse: !isHeaderExpanded }"
  >
    <b-navbar toggleable="lg" variant="faded" type="light">
      <b-navbar-brand href="/" class="header__logo">
        <div class="header__logo-image">
          <img src="@/assets/svg/logo.svg" />
        </div>
        <span>DemoSoftware</span>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item active> Your home </b-nav-item>
          <b-nav-item> Histories </b-nav-item>
          <b-nav-item> Indexing </b-nav-item>
          <b-nav-item> Search </b-nav-item>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto d-flex align-items-center">
          <b-btn pill size="sm" variant="link" class="mr-2">
            <i class="fa fa-question"></i>
          </b-btn>
          <b-btn pill size="sm" variant="link" class="mr-2">
            <i class="fa fa-comments"></i>
          </b-btn>
          <div
            v-if="currentUser && currentUser.head && currentUser.tail"
            class="d-flex align-items-center mr-3"
          >
            <b-avatar
              src="https://avatars1.githubusercontent.com/u/55615132?s=460&u=2f9a9fdcb58511a8267f0ce7bb5dacc0e1dd31a5&v=4"
            ></b-avatar>
            <div class="d-flex flex-column ml-2 email">
              <div v-if="currentUser.head">{{ currentUser.head }}</div>
              <em v-if="currentUser.tail">{{ currentUser.tail }}</em>
            </div>
          </div>
          <router-link v-else to="/login">
            <b-btn size="sm" variant="primary" class="px-3 mr-2 rounded">
              <i class="fa fa-sign-in mr-2"></i> Login
            </b-btn>
          </router-link>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Header',
  data() {
    return {
      currentUser: {
        head: '',
        tail: ''
      }
    }
  },
  watch: {
    $route() {
      this.getUser()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getUser()
    })
  },
  computed: {
    ...mapGetters({
      getHeaderState: 'getHeaderState'
    }),
    isHeaderExpanded() {
      return this.getHeaderState === 'expand'
    }
  },
  methods: {
    ...mapActions({
      getCurrentUser: 'getCurrentUser'
    }),
    getUser() {
      this.getCurrentUser().then((response) => {
        if (response && response.data) {
          const data = response.data.email.split('@')
          this.currentUser.head = data[0]
          this.currentUser.tail = `@${data[1]}`
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 58px;
  z-index: 3;
  background-color: #fff;
  transition: 0.5s ease;
  &__collapse {
    top: -58px;
  }
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    height: 4px;
    background: linear-gradient(
      180deg,
      rgba(9, 30, 66, 0.13) 0,
      rgba(9, 30, 66, 0.13) 1px,
      rgba(9, 30, 66, 0.08) 1px,
      rgba(9, 30, 66, 0) 4px
    );
  }
  /deep/ .navbar-brand {
    display: flex;
    align-items: center;
    margin-right: 40px;
  }
  /deep/ .navbar-collapse {
    height: 100%;
    .navbar-nav {
      height: 100%;
      .nav-item {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        border-radius: 3px;
        &:not(:last-child) {
          margin-right: 5px;
        }
        &:hover {
          .nav-link {
            color: rgb(0, 82, 204);
            background-color: rgba(222, 235, 255, 0.9);
          }
        }
        .nav-link {
          color: rgb(52, 69, 99);
          font-size: 14px;
          line-height: 14px;
          font-weight: 500;
          padding: 0.55rem 0.85rem;
          &.active {
            &::after {
              position: absolute;
              bottom: 0px;
              left: 4px;
              right: 4px;
              content: '';
              height: 3px;
              background-color: rgb(0, 82, 204);
              border-top-left-radius: 1px;
              border-top-right-radius: 1px;
            }
          }
        }
      }
    }
  }
  &__logo {
    span {
      font-size: 18px;
      font-weight: 500;
      color: #253858;
      padding-bottom: 1px;
    }
  }
  &__logo-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: rgba(222, 235, 255, 0.9);
    margin-right: 5px;
  }
  .email {
    div {
      font-size: 12px;
    }
    em {
      font-size: 11px;
      color: #969696;
    }
  }
  /deep/ .navbar {
    padding: 0 1rem;
    height: 100%;
  }
}
</style>
