<template>
  <div class="tree">
    <ul class="tree-list">
      <PersonCard :node="treeData" :handle-click="handleClick"></PersonCard>
    </ul>
  </div>
</template>

<script>
import PersonCard from '@/components/PersonCard/PersonCard'

export default {
  components: {
    PersonCard
  },
  props: {
    treeData: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    handleClick(node) {
      this.$emit('nodeClick', node)
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-list {
  padding-left: 0;
  & > li {
    &:before {
      content: none;
    }
  }
}
</style>
