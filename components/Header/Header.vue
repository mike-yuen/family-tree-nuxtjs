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
          <router-link to="/login">
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
export default {
  name: 'Header'
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
}
</style>
