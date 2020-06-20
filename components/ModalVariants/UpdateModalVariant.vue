<template>
  <div class="update-modal-variant">
    <form class="update-modal-variant__form">
      <div class="update-modal-variant__content">
        <div class="update-modal-variant__header">
          <h3>Edit this relation</h3>
          <a href="#">Delete <i class="faf fa-trash"></i></a>
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
                size="sm"
                v-model="firstname"
                placeholder="Enter your first name"
              ></b-form-input>
            </div>
            <div class="control col">
              <label for="surname">Last name</label>
              <b-form-input
                id="surname"
                size="sm"
                v-model="surname"
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
                size="sm"
                v-model="birthDate"
              ></b-form-input>
            </div>
            <div class="control col">
              <label for="birth-place">Place</label>
              <b-form-input
                id="birth-place"
                size="sm"
                v-model="birthPlace"
                placeholder="Town, state, etc."
              ></b-form-input>
            </div>
            <div class="control col">
              <label for="birth-address">Address</label>
              <b-form-input
                id="birth-address"
                size="sm"
                v-model="birthAddress"
                placeholder="Street or building"
              ></b-form-input>
            </div>
          </div>
        </div>
        <div
          class="update-modal-variant__group"
          ng-class="{'control-group--disabled': personEdit.IsLiving != false}"
        >
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
                size="sm"
                v-model="deathDate"
                disabled
              ></b-form-input>
            </div>
            <div class="control col">
              <label for="death-place">Place</label>
              <b-form-input
                id="death-place"
                size="sm"
                v-model="deathPlace"
                placeholder="Town, state, etc."
                disabled
              ></b-form-input>
            </div>
            <div class="control col">
              <label for="death-address">Address</label>
              <b-form-input
                id="death-address"
                size="sm"
                v-model="deathAddress"
                placeholder="Street or building"
                disabled
              ></b-form-input>
            </div>
          </div>
        </div>
      </div>

      <div class="update-modal-variant__footer">
        <div class="form-actions ng-binding">
          <button
            type="submit"
            class="btn btn-radius btn-primary btn-fullblue btn-large ng-binding"
            ng-disabled="data.buttonDisabled"
            data-tr="tree_quick_edit_save_button"
            data-tid="PersonQuickEdit.Submit"
          >
            Save changes
          </button>
          or
          <a
            href=""
            ng-click="reset()"
            data-tr="tree_quick_edit_cancel_button"
            data-tid="PersonQuickEdit.Cancel"
            translate=""
            class="ng-scope"
            >Cancel</a
          >
          <!-- ngIf: !data.relationship --><a
            ng-hide="serverError"
            ng-if="!data.relationship"
            class="nodal-modal__info ng-binding ng-scope"
            href=""
            ng-click="profile($event, actions.fullProfile)"
            data-tr="tree_quick_edit_full_profile_button"
            data-tid="PersonQuickEdit.FullEdit"
            >Full profile
            <i
              data-tr="tree_quick_edit_full_profile_button"
              class="fa fa-pencil"
            ></i></a
          ><!-- end ngIf: !data.relationship -->
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'UpdateModalVariant',
  data() {
    return {
      gender: 'male',
      status: 'living'
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
    background: #ffffff;
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
