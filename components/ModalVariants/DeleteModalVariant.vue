<template>
  <div class="delete-modal-variant">
    <div class="delete-modal-variant__header">
      <h3>Delete this person</h3>
    </div>
    <div class="delete-modal-variant__alert">
      <i class="faf fa-exclamation-triangle fa-4x"></i>
      <div class="delete-modal-variant__clearfix">
        <h4>Are you sure you want to delete this person?</h4>
        <div>Doing this means you will lose this information forever.</div>
      </div>
    </div>
    <div class="delete-modal-variant__footer">
      <b-button pill variant="primary" @click="onCloseModal(id)">
        Delete
      </b-button>
      <b-button pill variant="light" @click="onCloseModal(id)">
        C<i class="fa fa-poo"></i>ncel
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeleteModalVariant',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    onCloseModal(id) {
      this.$bvModal.hide(id)
    }
  }
}
</script>

<style lang="scss" scoped>
.delete-modal-variant {
  &__header {
    padding: 0 1rem;
    background: #fff;
    h3 {
      font-weight: bold;
      font-size: 16px;
      line-height: 1.25;
      margin: 10px 0 5px;
    }
  }
  &__alert {
    display: flex;
    align-items: center;
    padding: 8px 1rem;
    margin: 0;
    background-color: #fcf8e3;
    border: 1px solid #fbeed5;
    color: #c09853;
  }
  &__clearfix {
    margin-left: 17px;
    h4 {
      font-size: 18px;
      color: #242048;
      font-weight: bold;
      margin: 0;
    }
    div {
      font-size: 15px;
    }
  }
  &__footer {
    position: relative;
    border-bottom: 1px solid #f3f0ec;
    border-top: 1px solid #c8c8c8;
    background: #fff;
    padding: 1rem;
    width: 100%;
  }
}
</style>
