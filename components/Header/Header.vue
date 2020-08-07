<template>
  <header id="header" class="header">
    <b-navbar toggleable="lg" variant="faded" type="light">
      <b-navbar-brand href="/">
        <img class="header__logo" src="@/assets/images/logo.png" />
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item active> <i class="fa fa-home"></i> Home </b-nav-item>
          <b-nav-item> <i class="fa fa-scroll-old"></i> History </b-nav-item>
          <b-nav-item> <i class="fa fa-indent"></i> Indexing </b-nav-item>
          <b-nav-item> <i class="fa fa-search"></i> Search </b-nav-item>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
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
            <b-btn pill variant="info" class="px-4 mr-2">
              <i class="fa fa-sign-in mr-2"></i> Login
            </b-btn>
          </router-link>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<script>
import { mapActions } from 'vuex'

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
  z-index: 3;
  background-color: #fff;
  &__logo {
    height: 45px;
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
}
</style>
