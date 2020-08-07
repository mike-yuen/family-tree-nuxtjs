<template>
  <div class="nuxt-datepicker">
    <validation-provider
      v-slot="validationContext"
      name="datepicker"
      :rules="rules"
    >
      <date-picker
        v-model="dataValue"
        type="date"
        format="DD MMM YYYY"
        :disabled-date="disabledDate"
        placeholder="DD-MM-YYYY"
        :disabled="disabled"
        :class="{ error: validationContext.errors[0] }"
        :editable="false"
        :clearable="false"
      >
        <template slot="icon-calendar">
          <i class="fa fa-calendar" />
        </template>
      </date-picker>
    </validation-provider>
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
    disabled: Boolean,
    rules: Object
  },
  computed: {
    disabledDate() {
      return (date) => date > new Date()
    },
    dataValue: {
      get() {
        return this.$props.value ? new Date(this.$props.value) : new Date()
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
    &.error {
      input {
        border: 1px solid red;
      }
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
