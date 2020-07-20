<template>
  <div class="container">
    <section class="pedigree-view">
      <b-btn
        id="recenter"
        size="sm"
        variant="outline-secondary"
        class="pedigree-view__reset"
        title="Re-center"
        @click="reset()"
      >
        <i class="fa fa-location"></i>
      </b-btn>
      <svg
        id="svgPedigree"
        height="100%"
        width="100%"
        class="pedigree-view__svg"
      ></svg>
      <div id="pedigree" class="pedigree-view__content">
        <div id="pedigree-container" class="pedigree-view__container">
          <PersonTree :tree-data="tree" @nodeClick="logClick"></PersonTree>
        </div>
      </div>
    </section>
    <ActionModal id="action-modal" :data="dataPerson" />
    <FloatButton />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import * as d3 from 'd3'
// component
import ActionModal from '@/components/ActionModal/ActionModal'
import PersonTree from '@/components/PersonTree/PersonTree'
import FloatButton from '@/components/FloatButton/FloatButton'

export default {
  components: {
    ActionModal,
    PersonTree,
    FloatButton
  },
  data: () => {
    return {
      dataPerson: {},
      tree: {}
    }
  },
  computed: {
    pedigree() {
      return d3.select('#pedigree').on('click', this.reset)
    },
    pedigreContainer() {
      return d3.select('#pedigree-container').on('click', this.reset)
    },
    zoom() {
      return d3
        .zoom()
        .scaleExtent([0.05, 2])
        .on('zoom', this.zoomed)
    }
  },
  mounted() {
    this.pedigreContainer
      .attr('cx', (x) => x)
      .attr('cy', (y) => y)
      .on('click', this.clicked)
    this.pedigree.call(this.zoom)
  },
  methods: {
    ...mapActions({
      getTreeData: 'getTreeData',
      getPersonData: 'getPersonData'
    }),
    reset() {
      this.pedigree
        .transition()
        .duration(750)
        .call(
          this.zoom.transform,
          d3.zoomIdentity,
          d3
            .zoomTransform(this.pedigree.node())
            .invert([screen.width / 2, screen.width / 2])
        )
    },
    clicked(x, y) {
      d3.event.stopPropagation()
      if (
        Number.isNaN(d3.event.transform.k) ||
        Number.isNaN(d3.event.transform.x) ||
        Number.isNaN(d3.event.transform.y)
      ) {
        d3.event.transform.k = d3.event.transform.x = d3.event.transform.y = 1
        return
      }
      this.pedigree
        .transition()
        .duration(750)
        .call(
          this.zoom.transform,
          d3.zoomIdentity
            .translate(screen.width / 2, screen.height / 2)
            .scale(2)
            .translate(-x, -y),
          d3.mouse(this.pedigree.node())
        )
    },
    zoomed() {
      this.pedigreContainer.style(
        'transform',
        `translate(${d3.event.transform.x}px, ${d3.event.transform.y}px) scale(${d3.event.transform.k})`
      )
    },
    logClick(node) {
      this.getPersonData(node.id).then((response) => {
        if (response.data) {
          this.dataPerson = response.data
          console.log('___________node', response.data)
        }
      })
      this.$bvModal.show('action-modal')
      // if (node.children) {
      //   node.children.push({
      //     data: [{ name: `add-from-${node.data[0].name}` }]
      //   })
      // } else {
      //   Vue.set(node, 'children', [
      //     { data: [{ name: `new-from-${node.data[0].name}` }] }
      //   ])
      // }
    }
  },
  created() {
    this.getTreeData()
      .then((response) => {
        if (response.data) {
          this.tree = response.data
        }
      })
      .catch((err) => {
        console.log('err getTreeData', err)
      })
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
