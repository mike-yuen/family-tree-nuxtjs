<template>
  <div class="info-modal-variant">
    <div class="info-modal-variant__content">
      <ol class="info-modal-variant__timeline">
        <li class="info-modal-variant__timeline-event">
          <div class="info-modal-variant__icon">
            <i class="fa fa-baby"></i>
          </div>
          <div class="info-modal-variant__body">
            <h3>
              <strong>Born</strong>
              <span>{{ data.dob | moment('DD MMMM YYYY') }}</span>
            </h3>
            <div class="info-modal-variant__location">
              VietNam
            </div>
          </div>
        </li>
        <li v-if="data.spouse" class="info-modal-variant__timeline-event">
          <div class="info-modal-variant__icon">
            <i class="fa fa-restroom"></i>
          </div>
          <div class="info-modal-variant__body">
            <h3>
              <strong>Married</strong>
            </h3>
            <div>
              Spouse
              <a>
                <strong> {{ data.spouse.fullName }} </strong>
              </a>
            </div>
            <div v-if="data.childrenNames" class="info-modal-variant__children">
              Children from this marriage: {{ data.childrenNames }}
            </div>
          </div>
        </li>
        <li v-if="data.dod" class="info-modal-variant__timeline-event">
          <div class="info-modal-variant__icon">
            <strong class="timeline-event__year"></strong>
            <i class="fa fa-tombstone"></i>
          </div>
          <div class="info-modal-variant__body">
            <h3>
              <strong>Died</strong>
              <span>{{ data.dob | moment('DD MMMM YYYY') }}</span>
            </h3>
            <div class="info-modal-variant__location">
              Somewhere
            </div>
          </div>
        </li>
      </ol>
    </div>
    <div class="info-modal-variant__footer row">
      <a
        v-for="(item, index) in actionList"
        :id="item.id"
        :key="`action-modal-${index}`"
        class="info-modal-variant__button col"
        :class="{ 'info-modal-variant__button--disabled': item.disabled }"
        @click="onChangeState(item.action)"
      >
        <i :class="item.icon"></i> <span>{{ item.label }}</span>
        <b-tooltip v-if="item.disabled" :target="item.id" triggers="hover">
          {{ msgTooltip }}
        </b-tooltip>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoModalVariant',
  props: {
    id: {
      type: String,
      required: true
    },
    value: {},
    data: {}
  },
  data() {
    return {
      actionList: [
        {
          id: 'their-tree-tooltip',
          icon: 'faf fa-sitemap',
          label: 'Their tree',
          disabled: true
        },
        {
          id: 'profile-tooltip',
          icon: 'fa fa-user-cog',
          label: 'Profile',
          disabled: true
        },
        {
          id: 'edit-tooltip',
          icon: 'faf fa-pencil',
          label: 'Edit',
          action: 'edit'
        },
        {
          id: 'add-relative-tooltip',
          icon: 'faf fa-plus',
          label: 'Add relative',
          action: 'add'
        },
        {
          id: 'search-tooltip',
          icon: 'faf fa-search',
          label: 'Search',
          disabled: true
        },
        {
          id: 'hint-tooltip',
          icon: 'faf fa-question',
          label: 'Hint',
          disabled: true
        }
      ],
      msgTooltip: 'This function is not available!'
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
.info-modal-variant {
  color: #242048;
  &__content {
    overflow-x: hidden;
    margin: 0;
  }
  &__timeline {
    margin: 0 1rem;
    list-style: none;
    padding-left: 0;
  }
  &__timeline-event {
    display: flex;
    position: relative;
    overflow: hidden;
    padding: 10px 40px 10px 0;
    border-top: 2px solid #f3f0ec;
    font-size: 14px;
    line-height: 1.2;
    zoom: 1;
    &:first-child {
      border: 0;
    }
  }
  &__icon {
    margin: 0 10px 0 0;
    padding: 3px;
    width: 64px;
    text-align: center;
    font-size: 30px;
    line-height: 1.2;
    i {
      display: block;
      margin: 2px auto 6px;
    }
  }
  &__body {
    overflow: hidden;
    flex: 1;
    h3 {
      margin: 0;
      font-size: 18px;
      line-height: 1.2;
      span {
        font-weight: bold;
      }
    }
  }
  &__children {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  &__footer {
    position: relative;
    border-top: 1px solid #c8c8c8;
    background: #ffffff;
    margin: 0;
  }
  &__button {
    display: flex;
    flex-direction: column;
    text-align: center;
    height: 95px;
    background: #df9158;
    color: #fff;
    border: 1px solid;
    border-right-width: 0;
    padding: 0 5px;
    cursor: pointer;
    i {
      margin: 15px 0 8px;
      color: #ffffff;
      font-size: 32px;
    }
    span {
      font-size: 14px;
    }
    &--disabled {
      background: #636363;
      cursor: not-allowed;
    }
    &:last-child {
      border-right-width: 1px;
    }
    &:hover {
      background: #222;
      color: #fff;
    }
  }
}
</style>
