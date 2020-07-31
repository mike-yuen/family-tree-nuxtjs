<template>
  <div class="tree">
    <ul
      class="tree-list"
      :class="{ 'tree-list--one-child': hasOnlyOneChild(treeData) }"
    >
      <PersonCard
        :node="treeData"
        :one-child="hasOnlyOneChild(treeData)"
        :handle-click="handleClick"
      ></PersonCard>
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
  computed: {
    hasOnlyOneChild() {
      return (node) => node && node.children && node.children.length === 1
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
