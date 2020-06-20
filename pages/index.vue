<template>
  <div class="container">
    <section class="pedigree-view">
      <button @click="reset()">Reset</button>
      <svg
        id="svgPedigree"
        height="100%"
        width="100%"
        class="pedigree-view__svg"
      ></svg>
      <div id="pedigree" class="pedigree-view__content">
        <div id="pedigree-container" class="pedigree-view__container">
          <PersonCard />
          <PersonCard gender="female" />
          <PersonCard gender="unknown" />
          <PersonTree :tree-data="tree" @nodeClick="logClick"></PersonTree>
        </div>
      </div>
    </section>
    <ActionModal id="edit-modal" />
  </div>
</template>

<script>
import Vue from 'vue'
import * as d3 from 'd3'
// component
import ActionModal from '@/components/ActionModal/ActionModal'
import PersonCard from '@/components/PersonCard/PersonCard'
import PersonTree from '@/components/PersonTree/PersonTree'

export default {
  components: {
    ActionModal,
    PersonCard,
    PersonTree
  },
  data: () => {
    return {
      tree: {
        data: [{ name: 'husband1' }, { name: 'wife1' }],
        children: [
          {
            data: [{ name: 'husband2.1' }, { name: 'wife2.1' }],
            children: [
              {
                data: [{ name: 'husband3.1' }, { name: 'wife3.1' }]
              },
              {
                data: [{ name: 'husband3.2' }, { name: 'wife3.2' }],
                children: [
                  {
                    data: [{ name: 'husband4.1' }, { name: 'wife4.1' }]
                  }
                ]
              }
            ]
          },
          {
            data: [{ name: 'husband2.2' }, { name: 'wife2.2' }]
          }
        ]
      }
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
    console.log('aaaaaaaa')
    this.pedigreContainer
      .attr('cx', (x) => x)
      .attr('cy', (y) => y)
      .on('click', this.clicked)
    this.pedigree.call(this.zoom)
  },
  methods: {
    reset() {
      // d3.event.stopPropagation()
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
      console.log(this.zoom.transform)
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
    logClick(node, child) {
      console.log('Clicked: ', node, child)
      this.$bvModal.show('edit-modal')
      if (node.children) {
        node.children.push({
          data: [{ name: `add-from-${node.data[0].name}` }]
        })
      } else {
        Vue.set(node, 'children', [
          { data: [{ name: `new-from-${node.data[0].name}` }] }
        ])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
