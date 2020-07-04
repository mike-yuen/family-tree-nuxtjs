<template>
  <li v-if="node" class="node-tree">
    <div class="person-card-pair" :class="innerPairClass(node)">
      <div
        class="person-card"
        :class="innerClass(node)"
        @click="handleClick(node)"
      >
        <img
          class="person-card__image"
          :src="`images/icon_${genderMapping(node)}.png`"
        />
        <span v-if="false" class="person-card__loading">
          <img src="~assets/svg/spinner.svg" />
        </span>
        <div class="person-card__body">
          <h2 class="person-card__name">
            <span class="person-card__lastname">{{ node.name }}</span>
            <strong class="person-card__firstname">
              {{ node.name }}
            </strong>
          </h2>
          <small class="person-card__dates"
            >{{ node.dob | moment('YYYY') }}–Living</small
          >
        </div>
      </div>
      <div
        v-if="hasSpouse(node)"
        class="person-card"
        :class="[innerClass(node.spouse), 'person-card--spouse']"
        @click="handleClick(node.spouse)"
      >
        <img
          class="person-card__image"
          :src="`images/icon_${genderMapping(node.spouse.gender)}.png`"
        />
        <span v-if="false" class="person-card__loading">
          <img src="~assets/svg/spinner.svg" />
        </span>
        <div class="person-card__body">
          <h2 class="person-card__name">
            <span class="person-card__lastname">{{ node.spouse.name }}</span>
            <strong class="person-card__firstname">
              {{ node.spouse.name }}
            </strong>
          </h2>
          <small class="person-card__dates"
            >{{ node.spouse.dob | moment('YYYY') }}–Living</small
          >
        </div>
      </div>
      <div
        v-if="!hasSpouse(node) && hasChildren(node)"
        class="person-card person-card--empty person-card--spouse"
      ></div>
    </div>
    <ul v-if="hasChildren(node)" class="node-tree__branch">
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
    node: {
      type: Object,
      default: () => {}
    },
    handleClick: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      personClass: 'person-card'
    }
  },
  computed: {
    genderMapping() {
      return (node) => (node && node.gender ? 'male' : 'female')
    },
    innerPairClass() {
      return (node) =>
        this.hasSpouse(node) || this.hasChildren(node)
          ? `${this.personClass}-pair--has-spouse`
          : ''
    },
    innerClass() {
      return (node) => {
        const usefulKeys = ['gender', 'level', 'spouse']
        return usefulKeys
          .reduce((acc, current) => {
            switch (current) {
              case 'gender':
                acc.push(`${this.personClass}--${this.genderMapping(node)}`)
                break
              case 'level':
                acc.push(`${this.personClass}--level-${node[current]}`)
                break
            }
            return acc
          }, [])
          .join(' ')
      }
    },
    hasSpouse() {
      return (node) => node && node.spouse
    },
    hasChildren() {
      return (node) => node && node.children && node.children.length
    }
  }
}
</script>

<style lang="scss" scoped>
@import './PersonCard.scss';
</style>
