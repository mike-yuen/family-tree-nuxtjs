<template>
  <div class="update-modal-variant">
    <div v-if="stateValue === 'add'" class="update-modal-variant__content">
      <div class="update-modal-variant__header">
        <h3>Choose a relative to add</h3>
      </div>
      <ul class="update-modal-variant__list">
        <li @click="onChangeState('edit')">
          <a>
            <div class="update-modal-variant__plus-icon">
              <i class="faf fa-plus"></i>
            </div>
            <div class="update-modal-variant__relative">
              <h2>
                <strong>Spouse</strong>
              </h2>
            </div>
          </a>
        </li>
        <li @click="onChangeState('edit')">
          <a>
            <div class="update-modal-variant__plus-icon">
              <i class="faf fa-plus"></i>
            </div>
            <div class="update-modal-variant__relative">
              <h2>
                <strong>Sibling</strong>
              </h2>
            </div>
          </a>
        </li>
        <li @click="onChangeState('edit')">
          <a>
            <div class="update-modal-variant__plus-icon">
              <i class="faf fa-plus"></i>
            </div>
            <div class="update-modal-variant__relative">
              <h2>
                <strong>Child</strong>
              </h2>
            </div>
          </a>
        </li>
      </ul>
    </div>
    <form v-if="stateValue === 'edit'" class="update-modal-variant__form">
      <div class="update-modal-variant__content">
        <div class="update-modal-variant__header">
          <h3>Edit this relation</h3>
          <a @click="onChangeState('delete')">
            Delete <i class="faf fa-trash"></i>
          </a>
        </div>
        <div class="update-modal-variant__group">
          <div
            class="update-modal-variant__mainlabel update-modal-variant__mainlabel--margin"
          >
            <span>
              <i class="fa fa-exclamation-triangle"></i>
              Name
            </span>
            <small> Required </small>
          </div>
          <div class="update-modal-variant__controls row">
            <div class="control col">
              <label for="firstname"> First and middle names </label>
              <b-form-input
                id="firstname"
                v-model="firstname"
                size="sm"
                placeholder="Enter your first name"
              ></b-form-input>
            </div>
            <div class="control col">
              <label for="surname">Last name</label>
              <b-form-input
                id="surname"
                v-model="surname"
                size="sm"
                placeholder="Enter your last name"
              ></b-form-input>
            </div>
          </div>
        </div>
        <div class="update-modal-variant__group">
          <div class="update-modal-variant__mainlabel">Gender</div>
          <div class="update-modal-variant__controls">
            <div class="control control--radio">
              <b-form-radio v-model="gender" name="gender" value="male">
                Male
              </b-form-radio>
            </div>
            <div class="control control--radio">
              <b-form-radio v-model="gender" name="gender" value="female">
                Female
              </b-form-radio>
            </div>
          </div>
        </div>
        <div class="update-modal-variant__group">
          <div class="update-modal-variant__mainlabel">Status</div>
          <div class="update-modal-variant__controls">
            <div class="control control--radio">
              <b-form-radio v-model="status" name="status" value="living">
                Living
              </b-form-radio>
            </div>
            <div class="control control--radio">
              <b-form-radio v-model="status" name="status" value="deceased">
                Deceased
              </b-form-radio>
            </div>
          </div>
        </div>
        <div class="update-modal-variant__group">
          <div
            class="update-modal-variant__mainlabel update-modal-variant__mainlabel--margin"
          >
            Birth
          </div>
          <div class="update-modal-variant__controls row">
            <div class="control col">
              <label for="birth-date">Date</label>
              <b-form-input
                id="birth-date"
                v-model="birthDate"
                size="sm"
              ></b-form-input>
            </div>
            <div class="control col">
              <label for="birth-place">Place</label>
              <b-form-input
                id="birth-place"
                v-model="birthPlace"
                size="sm"
                placeholder="Town, state, etc."
              ></b-form-input>
            </div>
            <div class="control col">
              <label for="birth-address">Address</label>
              <b-form-input
                id="birth-address"
                v-model="birthAddress"
                size="sm"
                placeholder="Street or building"
              ></b-form-input>
            </div>
          </div>
        </div>
        <div class="update-modal-variant__group">
          <div
            class="update-modal-variant__mainlabel update-modal-variant__mainlabel--margin"
          >
            Death
          </div>
          <div class="update-modal-variant__controls">
            <div class="control col">
              <label for="death-date">Date</label>
              <b-form-input
                id="death-date"
                v-model="deathDate"
                size="sm"
                :disabled="!isDeceased"
              ></b-form-input>
            </div>
            <div class="control col">
              <label for="death-place">Place</label>
              <b-form-input
                id="death-place"
                v-model="deathPlace"
                size="sm"
                placeholder="Town, state, etc."
                :disabled="!isDeceased"
              ></b-form-input>
            </div>
            <div class="control col">
              <label for="death-address">Address</label>
              <b-form-input
                id="death-address"
                v-model="deathAddress"
                size="sm"
                placeholder="Street or building"
                :disabled="!isDeceased"
              ></b-form-input>
            </div>
          </div>
        </div>
      </div>
      <div class="update-modal-variant__footer">
        <b-button pill variant="info" class="px-4" @click="onCloseModal(id)">
          Save Changes
        </b-button>
        <b-button
          pill
          variant="outline-info"
          class="ml-2 px-4"
          @click="onCloseModal(id)"
        >
          C<i class="fa fa-poo"></i>ncel
        </b-button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'UpdateModalVariant',
  props: {
    id: {
      type: String,
      required: true
    },
    value: {}
  },
  data() {
    return {
      firstname: '',
      surname: '',
      gender: 'male',
      status: 'living',
      birthDate: '',
      birthPlace: '',
      birthAddress: '',
      deathDate: '',
      deathPlace: '',
      deathAddress: ''
    }
  },
  computed: {
    stateValue: {
      get() {
        return this.$props.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    isDeceased() {
      return this.status === 'deceased'
    }
  },
  methods: {
    onCloseModal(id) {
      this.$bvModal.hide(id)
    },
    onChangeState(action) {
      if (action) this.stateValue = action
    }
  }
}
</script>

<style lang="scss" scoped>
.update-modal-variant {
  &__form {
    background: #f7f7f7;
    border-bottom: 1px solid #f3f0ec;
    color: #242048;
  }
  &__content {
    overflow-x: hidden;
    margin: 0;
  }
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    padding: 0 1rem;
    h3 {
      font-weight: bold;
      font-size: 16px;
      line-height: 1.25;
      margin: 10px 0 5px;
    }
    a {
      text-align: right;
      font-weight: bold;
      font-size: 12px;
      color: #5678a2;
      margin: 10px 0 5px;
      cursor: pointer;
    }
  }
  &__list {
    padding: 0 1px;
    border-top: 1px solid #c8c8c8;
    list-style: none;
    margin-bottom: 0;
    li {
      border-top: 1px solid #f3f0ec;
      &:first-child {
        border-top: 0;
      }
      & > a {
        position: relative;
        display: flex;
        align-items: center;
        margin: 0;
        padding: 0 1rem;
        width: 100%;
        border: 1px solid transparent;
        background: transparent;
        color: #333333;
        text-align: left;
        font-size: 12px;
        line-height: 1;
        transition: border 250ms cubic-bezier(0.645, 0.045, 0.355, 1),
          box-shadow 250ms cubic-bezier(0.645, 0.045, 0.355, 1);
        cursor: pointer;
        border-radius: 4px;
        &:hover {
          border: 1px solid #5678a2;
          .update-modal-variant {
            &__plus-icon {
              background: #5678a2;
            }
          }
        }
      }
      .update-modal-variant {
        &__plus-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          background: #7c7c7c;
          color: #fff;
          text-align: center;
          transition: background 250ms cubic-bezier(0.645, 0.045, 0.355, 1);
          margin: 10px 10px 10px 0;
          border-radius: 50%;
          i {
            font-size: 24px;
            color: #fff;
          }
        }
        &__relative {
          font-size: 12px;
          h2 {
            font-size: 16px;
            margin: 0;
          }
        }
      }
    }
  }
  &__group {
    display: flex;
    padding: 10px 0;
    margin: 0;
    border-top: 1px solid #f3f0ec;
    border-color: #ffffff;
    background: #f7f7f7;
  }
  &__mainlabel {
    min-width: 95px;
    font-weight: 500;
    font-size: 16px;
    text-align: right;
    &--margin {
      padding-top: 6px;
      margin-top: 15px;
    }
    small {
      display: block;
      color: #7c7c7c;
      font-weight: normal;
      font-size: 12px;
      line-height: 1;
    }
  }
  &__controls {
    display: flex;
    margin: 0 20px;
    width: 100%;
    .control {
      color: #242048;
      margin-right: 10px;
      &.col {
        padding-left: 0;
        margin-right: 0;
      }
      &--radio {
        margin-right: 20px;
      }
      label {
        margin-top: -5px;
        margin-bottom: 0;
        font-size: 12px;
      }
    }
  }
  &__footer {
    position: relative;
    border-bottom: 1px solid #f3f0ec;
    border-top: 1px solid #c8c8c8;
    background: #ffffff;
    padding: 1rem;
    width: 100%;
  }
}
</style>
