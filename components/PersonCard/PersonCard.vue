<template>
  <li v-if="node" class="node-tree">
    <div v-if="node && node.data && node.data.length" class="person-card-pair">
      <div
        v-for="(root, index) in node.data"
        :key="index"
        class="person-card"
        :class="innerGender"
        @click="handleClick(node, root)"
      >
        <img class="person-card__image" :src="`images/icon_${gender}.png`" />
        <span v-if="false" class="person-card__loading">
          <img src="~assets/svg/spinner.svg" />
        </span>
        <div class="person-card__body">
          <h2 class="person-card__name">
            <span class="person-card__lastname">Do Nguyen Hoang Minh</span>
            <strong class="person-card__firstname">
              {{ root.name }}
            </strong>
          </h2>
          <small class="person-card__dates">1996–Living</small>
        </div>
      </div>
    </div>
    <ul
      v-if="node && node.children && node.children.length"
      class="node-tree__branch"
    >
      <PersonCard
        v-for="(child, index) in node.children"
        :key="index"
        :node="child"
        :handle-click="handleClick"
      >
      </PersonCard>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'PersonCard',
  props: {
    node: Object,
    handleClick: Function,
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
