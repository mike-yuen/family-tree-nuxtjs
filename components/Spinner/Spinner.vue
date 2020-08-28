<template>
  <div class="overlay">
    <div class="spinner center">
      <div v-for="index in 12" :key="index" class="spinner-blade"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Spinner'
}
</script>

<style lang="scss" scoped>
$spinner-size: 28px !default;
$spinner-color: #69717d !default;
@mixin absolute-center {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
.overlay {
  @include absolute-center;
  z-index: 2;
}

.spinner {
  font-size: $spinner-size;
  position: relative;
  display: inline-block;
  width: 1em;
  height: 1em;
  &.center {
    @include absolute-center;
  }
}
.spinner-blade {
  position: absolute;
  left: 0.4629em;
  bottom: 0;
  width: 0.074em;
  height: 0.2777em;
  border-radius: 0.5em;
  background-color: transparent;
  transform-origin: center -0.2222em;
  animation: spinner-fade 1s infinite linear;

  $animation-delay: 0s;
  $blade-rotation: 0deg;

  @for $i from 1 through 12 {
    &:nth-child(#{$i}) {
      animation-delay: $animation-delay;
      transform: rotate($blade-rotation);
      $blade-rotation: $blade-rotation + 30;
      $animation-delay: $animation-delay + 0.083;
    }
  }
}
@keyframes spinner-fade {
  0% {
    background-color: $spinner-color;
  }
  100% {
    background-color: transparent;
  }
}
</style>
