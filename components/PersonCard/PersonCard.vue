<template>
  <!-- 'person-card--empty': true, -->
  <!-- 'person-card--female': true, -->
  <div class="person-card" :class="innerGender">
    <img class="person-card__image" :src="`images/icon_${gender}.png`" />
    <span v-if="false" class="person-card__loading">
      <img src="~assets/svg/spinner.svg" />
    </span>
    <div class="person-card__body">
      <h2 class="person-card__name">
        <span class="person-card__lastname">Do Nguyen Hoang Minh</span>
        <strong class="person-card__firstname"> Chien </strong>
      </h2>
      <small class="person-card__dates">1996–Living</small>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonCard',
  props: {
    gender: {
      type: String,
      default: 'male'
    }
  },
  computed: {
    innerGender() {
      return 'person-card--' + this.gender
    }
  }
}
</script>

<style lang="scss" scoped>
@import './PersonCard.scss';
</style>
