<template>
  <a class="float-button" href="" target="_blank">
    <span class="float-button__icon">
      <i class="faf fa-github"></i>
    </span>
    <span class="float-button__label">
      Github
    </span>
  </a>
</template>

<script>
export default {
  name: 'FloatButton'
}
</script>

<style lang="scss" scoped>
.float-button {
  position: fixed;
  display: flex;
  align-items: center;
  bottom: 40px;
  right: 30px;
  z-index: 2;
  padding: 12px 20px;
  font-size: 16px;
  background-color: #077f92;
  color: #fff;
  border-radius: 50px;
  font-weight: 600;
  i {
    font-size: 20px;
    margin-right: 10px;
  }
  &:hover {
    text-decoration: none;
  }
}
</style>
