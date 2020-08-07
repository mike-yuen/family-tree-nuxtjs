<template>
  <div class="update-modal-variant">
    <div v-if="stateValue === 'add'" class="update-modal-variant__content">
      <div class="update-modal-variant__header">
        <h3>Choose a relative to add</h3>
      </div>
      <ul class="update-modal-variant__list">
        <li v-if="!dataForUI.spouse" @click="onChangeState('edit', 'SPOUSE')">
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
        <li
          v-if="dataForApi.level > 0"
          @click="onChangeState('edit', 'SIBLING')"
        >
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
        <li @click="onChangeState('edit', 'CHILD')">
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
        <div v-if="typeRelationship" class="update-modal-variant__header">
          <h3>Add a new {{ typeRelationship | capitalize }}</h3>
        </div>
        <div v-else class="update-modal-variant__header">
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
                v-model="internalPersonData.firstName"
                size="sm"
                placeholder="Enter your first name"
              ></b-form-input>
            </div>
            <div class="control col">
              <label for="surname">Last name</label>
              <b-form-input
                id="lastName"
                v-model="internalPersonData.lastName"
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
              <b-form-radio
                v-model="internalPersonData.gender"
                name="gender"
                :value="true"
              >
                Male
              </b-form-radio>
            </div>
            <div class="control control--radio">
              <b-form-radio
                v-model="internalPersonData.gender"
                name="gender"
                :value="false"
              >
                Female
              </b-form-radio>
            </div>
          </div>
        </div>
        <div class="update-modal-variant__group">
          <div class="update-modal-variant__mainlabel">Status</div>
          <div class="update-modal-variant__controls">
            <div class="control control--radio">
              <b-form-radio
                v-model="internalPersonData.isLiving"
                name="status"
                :value="true"
              >
                Living
              </b-form-radio>
            </div>
            <div class="control control--radio">
              <b-form-radio
                v-model="internalPersonData.isLiving"
                name="status"
                :value="false"
              >
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
              <no-ssr>
                <DatePicker id="birth-date" v-model="internalPersonData.dob" />
              </no-ssr>
            </div>
            <div class="control col">
              <label for="birth-place">Place</label>
              <b-form-select
                id="birthdeath-place"
                v-model="internalPersonData.birthLocation.countryId"
                :options="placeOptions"
                value-field="id"
                text-field="name"
                size="sm"
              >
              </b-form-select>
            </div>
            <div class="control col">
              <label for="birth-address">Address</label>
              <b-form-input
                id="birth-address"
                v-model="internalPersonData.birthLocation.address"
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
              <no-ssr>
                <DatePicker
                  id="death-date"
                  v-model="internalPersonData.dod"
                  :disabled="!isDeceased"
                />
              </no-ssr>
            </div>
            <div class="control col">
              <label for="death-place">Place</label>
              <b-form-select
                id="death-place"
                v-model="internalPersonData.deathLocation.countryId"
                :options="placeOptions"
                value-field="id"
                text-field="name"
                size="sm"
                :disabled="!isDeceased"
              >
              </b-form-select>
            </div>
            <div class="control col">
              <label for="death-address">Address</label>
              <b-form-input
                id="death-address"
                v-model="internalPersonData.deathLocation.address"
                size="sm"
                placeholder="Street or building"
                :disabled="!isDeceased"
              ></b-form-input>
            </div>
          </div>
        </div>
      </div>
      <div class="update-modal-variant__footer">
        <b-button pill variant="info" class="px-4" @click="onSaveModal(id)">
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
import { mapActions } from 'vuex'
import DatePicker from '@/components/DatePicker/DatePicker'

export default {
  name: 'UpdateModalVariant',
  components: {
    DatePicker
  },
  filters: {
    capitalize(string) {
      if (typeof string !== 'string') return ''
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    value: {},
    personData: {}
  },
  data() {
    return {
      dataForUI: {
        spouse: null,
        children: null
      },
      dataForApi: {
        id: '',
        level: 0,
        parentId: null
      },
      internalPersonData: {
        firstName: '',
        lastName: '',
        gender: true,
        isLiving: true,
        dob: null,
        dod: null,
        birthLocation: {
          countryId: 0,
          address: ''
        },
        deathLocation: {
          countryId: 0,
          address: ''
        },
        code: 'SIBLING',
        level: 1
      },
      // internal
      isCreated: 'false',
      typeRelationship: '',
      placeOptions: []
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
      return !this.internalPersonData.isLiving
    }
  },
  methods: {
    ...mapActions({
      getCountries: 'getCountries',
      addPersonData: 'addPersonData',
      editPersonData: 'editPersonData'
    }),
    onCloseModal(id) {
      this.$bvModal.hide(id)
    },
    handleAddPerson() {
      switch (this.typeRelationship) {
        case 'SPOUSE':
          this.internalPersonData.code = 'SPOUSE'
          this.internalPersonData.level = this.dataForApi.level
          break
        case 'SIBLING':
          this.internalPersonData.code = 'SIBLING'
          this.internalPersonData.level = this.dataForApi.level
          break
        case 'CHILD':
          this.internalPersonData.code = 'CHILD'
          this.internalPersonData.level = this.dataForApi.level + 1
          this.dataForApi.parentId = this.dataForApi.id
          break
      }
      const data = Object.assign({}, this.dataForApi)
      this.$set(data, 'relationshipInput', this.internalPersonData)
      this.addPersonData(data).then((response) => {
        this.$emit('reloadData')
        this.onCloseModal(this.id)
      })
    },
    handleEditPerson() {
      const id = this.dataForApi.id || this.personData.id
      const data = Object.assign({}, this.internalPersonData)
      this.$set(data, 'id', id)
      this.editPersonData(data).then((response) => {
        this.$emit('reloadData')
        this.onCloseModal(this.id)
      })
    },
    onSaveModal() {
      if (this.dataForApi.id) {
        this.handleAddPerson()
      } else {
        this.handleEditPerson()
      }
    },
    onChangeState(action, typeRelationship = '') {
      if (action) {
        if (this.stateValue === 'add') {
          this.isCreated = true
        }
        this.typeRelationship = typeRelationship
        this.stateValue = action
        this.$emit('typeRelationship', this.typeRelationship)
      }
    },
    setRootPersonData() {
      this.dataForApi.id = this.personData.id || ''
      this.dataForApi.level = this.personData.level || 0
      this.dataForApi.parentId = this.personData.parentId || null

      this.dataForUI.spouse = this.personData.spouse || null
      this.dataForUI.children = this.personData.children || null
    },
    setPersonDataIntoInternal() {
      this.internalPersonData.firstName = this.personData.firstName || ''
      this.internalPersonData.lastName = this.personData.lastName || ''
      this.internalPersonData.gender = this.personData.gender
      this.internalPersonData.isLiving = this.personData.isLiving
      this.internalPersonData.dob = this.personData.dob || null
      this.internalPersonData.dod = this.personData.dod || null
      this.internalPersonData.birthLocation = {
        ...this.personData.birthLocation
      } || {
        countryId: 0,
        address: ''
      }
      this.internalPersonData.deathLocation = {
        ...this.personData.deathLocation
      } || {
        countryId: 0,
        address: ''
      }
    }
  },
  watch: {
    'internalPersonData.gender': {
      handler(newValue) {
        this.$emit('changePersonGender', newValue)
      },
      deep: true
    }
  },
  created() {
    if (this.stateValue === 'add') {
      this.setRootPersonData()
    }
    if (this.stateValue === 'edit') {
      this.setPersonDataIntoInternal()
    }
    this.getCountries().then((response) => {
      if (response.data) {
        this.placeOptions = [
          { id: 0, name: 'Town, state, etc.' },
          ...response.data
        ]
      }
    })
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
