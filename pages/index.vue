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
          <PersonTree v-model="tree" @nodeClick="logClick"></PersonTree>
        </div>
      </div>
    </section>
    <ActionModal
      id="action-modal"
      :data="dataPerson"
      @deleteNodeData="deleteNodeData"
      @editNodeData="editNodeData"
    />
    <b-toast id="warning-toast" variant="warning" solid>
      <template v-slot:toast-title>
        <div class="d-flex flex-grow-1 align-items-baseline">
          <b-img
            blank
            blank-color="#ff5555"
            class="mr-2"
            width="12"
            height="12"
          ></b-img>
          <strong class="mr-auto">Notice!</strong>
        </div>
      </template>
      Please login before action. Go to
      <nuxt-link to="/login">Login</nuxt-link>
    </b-toast>
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
      tree: {},
      selectedNode: {}
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
  created() {
    this.getTreeData().then((response) => {
      if (response.data) {
        this.tree = response.data
      }
    })
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
    prepareDeleteData(treeData, parentId, id) {
      if (treeData.id === parentId) {
        const needRemoveIndex = treeData.children.findIndex(
          (child) => child.id === id
        )
        if (needRemoveIndex !== -1) {
          treeData.children.splice(needRemoveIndex, 1)
        }
      } else if (treeData.children !== null) {
        for (let i = 0; i < treeData.children.length; i++) {
          this.prepareDeleteData(treeData.children[i], parentId, id)
        }
      }
      return treeData
    },
    prepareEditData(treeData, data) {
      if (treeData.id === data.id) {
        for (const prop in data) {
          this.$set(treeData, [prop], data[prop])
        }
      } else if (treeData.children !== null) {
        for (let i = 0; i < treeData.children.length; i++) {
          this.prepareEditData(treeData.children[i], data)
        }
      }
      return treeData
    },
    deleteNodeData() {
      const result = this.prepareDeleteData(
        JSON.parse(JSON.stringify(this.tree)),
        this.selectedNode.parentId,
        this.selectedNode.id
      )
      this.tree = result
    },
    editNodeData(data) {
      const result = this.prepareEditData(
        JSON.parse(JSON.stringify(this.tree)),
        data
      )
      this.tree = result
    },
    logClick(node) {
      this.getPersonData(node.id).then((response) => {
        if (response.data) {
          this.dataPerson = response.data
          this.selectedNode = Object.assign({}, node)
          this.$bvModal.show('action-modal')
        } else {
          this.$bvToast.show('warning-toast')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
