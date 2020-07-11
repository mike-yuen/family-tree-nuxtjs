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
      tree: {
        id: '3a7d90d5-f050-47df-9550-59613dd57d5e',
        name: 'Root level - husband',
        level: 1,
        gender: true,
        dob: '1920-06-13T00:00:00',
        isPassedAway: false,
        parentId: null,
        spouse: {
          id: 'f321bbac-b40f-4035-9e2c-67bf768aaefe',
          name: 'Rool level -wife',
          level: 1,
          gender: false,
          dob: '1925-06-20T00:00:00',
          isPassedAway: false,
          parentId: null,
          spouse: null,
          children: []
        },
        children: [
          {
            id: 'ab150efa-0f3b-41f1-b64f-cf2c4444b39c',
            name: '1st Level _Male',
            level: 2,
            gender: true,
            dob: '1945-06-01T00:00:00',
            isPassedAway: false,
            parentId: '3a7d90d5-f050-47df-9550-59613dd57d5e',
            spouse: {
              id: 'd1147550-c100-440a-99b9-721e5eabb1d8',
              name: '1st Level - Others - Female',
              level: 2,
              gender: false,
              dob: '1947-07-20T00:00:00',
              isPassedAway: false,
              parentId: null,
              spouse: null,
              children: []
            },
            children: []
          },
          {
            id: 'ab150efa-0f3b-41f1-b64f-cf2c4444b39d',
            name: '1sl Level - 02 _Female',
            level: 2,
            gender: false,
            dob: '1946-06-15T00:00:00',
            isPassedAway: false,
            parentId: '3a7d90d5-f050-47df-9550-59613dd57d5e',
            spouse: null,
            children: [
              {
                id: 'ab150efa-0f3b-41f1-b64f-cf2c4444b39c',
                name: '2st Level _Male',
                level: 3,
                gender: true,
                dob: '1945-06-01T00:00:00',
                isPassedAway: false,
                parentId: '3a7d90d5-f050-47df-9550-59613dd57d5e'
              }
            ]
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
    this.pedigreContainer
      .attr('cx', (x) => x)
      .attr('cy', (y) => y)
      .on('click', this.clicked)
    this.pedigree.call(this.zoom)
  },
  methods: {
    ...mapActions({
      getTreeData: 'getTreeData'
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
      this.dataPerson = node
      this.getTreeData()
        .then((data) => {
          console.log('data', data)
        })
        .catch((err) => {
          console.log('err index', err)
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
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
