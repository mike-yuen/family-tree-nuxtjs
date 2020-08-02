<template>
  <div class="nuxt-datepicker">
    <date-picker
      v-model="dataValue"
      type="date"
      format="DD MMM YYYY"
      :disabled-date="disabledDate"
      placeholder="DD-MM-YYYY"
      :disabled="disabled"
    >
      <template slot="icon-calendar">
        <i class="fa fa-calendar" />
      </template>
    </date-picker>
  </div>
</template>

<script>
export default {
  name: 'Datepicker',
  props: {
    value: [String, Date],
    typeOption: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: Boolean
  },
  computed: {
    disabledDate() {
      return (date) => date > new Date()
    },
    dataValue: {
      get() {
        return this.$props.value ? new Date(this.$props.value) : null
      },
      set(val) {
        this.$emit('input', this.$moment(val).toISOString())
      }
    }
  }
}
</script>

<style lang="scss">
.nuxt-datepicker {
  .mx-datepicker {
    width: 100%;
    input {
      height: calc(1.5em + 0.5rem + 2px);
      border-radius: 0;
    }
  }
  .mx-input:disabled {
    color: #6c757d;
    background-color: #e9ecef;
    border: 1px solid #ced4da;
    cursor: default;
    box-shadow: none;
  }
}
</style>
