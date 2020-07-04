<template>
  <b-modal
    :id="id"
    size="mdx"
    centered
    hide-footer
    header-class="p-0"
    body-class="p-0"
    @show="resetModal"
  >
    <template v-slot:modal-header>
      <div class="edit-modal-header">
        <div class="edit-modal-header__node">
          <div class="edit-modal-header__scope">
            <img
              class="edit-modal-header__avatar"
              :src="`images/icon_${genderMapping(data)}.png`"
            />
            <div class="edit-modal-header__scope__body">
              <h2>
                <span>{{ data.name }}</span>
                <span>Bell</span>
              </h2>
              <small>{{ data.dob | moment('YYYY') }}-Living</small>
            </div>
          </div>
        </div>
        <a class="edit-modal-header__close" @click="onCloseModal(id)">
          <i class="fa fa-times"></i>
          <span class="d-none">Close</span>
        </a>
      </div>
    </template>
    <div class="edit-modal-body">
      <DeleteModalVariant v-if="isCurrentState(['delete'])" :id="id" />
      <InfoModalVariant
        v-if="isCurrentState(['info'])"
        :id="id"
        v-model="actionState"
        :data="data"
      />
      <UpdateModalVariant
        v-if="isCurrentState(['add', 'edit'])"
        :id="id"
        v-model="actionState"
      />
    </div>
  </b-modal>
</template>

<script>
import DeleteModalVariant from '@/components/ModalVariants/DeleteModalVariant'
import InfoModalVariant from '@/components/ModalVariants/InfoModalVariant'
import UpdateModalVariant from '@/components/ModalVariants/UpdateModalVariant'

export default {
  name: 'ActionModal',
  components: {
    DeleteModalVariant,
    InfoModalVariant,
    UpdateModalVariant
  },
  props: {
    id: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      gender: 'male',
      actionState: 'info' // <edit> | <add> | <delete>
    }
  },
  computed: {
    genderMapping() {
      return (node) => (node && node.gender ? 'male' : 'female')
    },
    isCurrentState() {
      return (state) =>
        state.length ? state.includes(this.actionState) : false
    }
  },
  methods: {
    onCloseModal(id) {
      this.$bvModal.hide(id)
    },
    resetModal() {
      this.actionState = 'info'
    }
  }
}
</script>

<style lang="scss" scoped>
@import './ActionModal.scss';
</style>
