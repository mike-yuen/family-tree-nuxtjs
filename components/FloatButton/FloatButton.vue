<template>
  <a
    class="float-button px-3 py-2 rounded"
    href="https://github.com/minhnguyen1505"
    target="_blank"
  >
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
  font-size: 16px;
  background-color: rgb(0, 82, 204);
  color: #fff;
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
