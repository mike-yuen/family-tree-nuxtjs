<template>
  <b-modal
    :id="id"
    size="mdx"
    centered
    hide-footer
    header-class="p-0"
    body-class="p-0"
  >
    <template v-slot:modal-header>
      <div class="edit-modal-header">
        <div class="edit-modal-header__node">
          <div class="edit-modal-header__scope">
            <img
              class="edit-modal-header__avatar"
              :src="`images/icon_${gender}.png`"
            />
            <div class="edit-modal-header__scope__body">
              <h2>
                <span>Alexxxxx Ghost Graham</span>
                <span>Bell</span>
              </h2>
              <small>Living</small>
            </div>
          </div>
        </div>
        <a class="edit-modal-header__close">
          <i class="fa fa-times"></i>
          <span class="d-none">Close</span>
        </a>
      </div>
    </template>

    <div class="edit-modal-body">
      <UpdateModalVariant />
    </div>
  </b-modal>
</template>

<script>
import UpdateModalVariant from '@/components/ModalVariants/UpdateModalVariant'

export default {
  name: 'ActionModal',
  components: {
    UpdateModalVariant
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      gender: 'male'
    }
  }
}
</script>

<style lang="scss" scoped>
@import './ActionModal.scss';
</style>
