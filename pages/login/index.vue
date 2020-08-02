<template>
  <div class="login-page">
    <div class="container">
      <h1 class="login-page__title">Log in to my account</h1>
      <div class="row">
        <div class="col-md-8">
          <section class="login-page__section">
            <validation-observer ref="observer" v-slot="{ handleSubmit }">
              <b-form
                @submit.stop.prevent="handleSubmit(onSubmit)"
                @reset="onReset"
              >
                <validation-provider
                  v-slot="validationContext"
                  name="email"
                  :rules="{ required: true, email: true }"
                >
                  <b-form-group
                    id="email"
                    label="Email address"
                    label-for="email-input"
                  >
                    <b-form-input
                      id="email-input"
                      v-model="form.email"
                      :state="getValidationState(validationContext)"
                      type="email"
                      required
                      placeholder="your@email.com"
                    ></b-form-input>
                    <b-form-invalid-feedback id="email-input-feedback">
                      {{ validationContext.errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
                <validation-provider
                  v-slot="validationContext"
                  name="password"
                  :rules="{ required: true }"
                >
                  <b-form-group
                    id="password"
                    label="Password"
                    label-for="password-input"
                  >
                    <b-form-input
                      id="password-input"
                      v-model="form.password"
                      :state="getValidationState(validationContext)"
                      required
                      placeholder="your password"
                      type="password"
                    ></b-form-input>
                    <b-form-invalid-feedback id="password-input-feedback">
                      {{ validationContext.errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
                <b-form-group>
                  <b-form-checkbox
                    id="checkbox"
                    v-model="form.checked"
                    :value="true"
                    :unchecked-value="false"
                  >
                    Remember me
                  </b-form-checkbox>
                </b-form-group>
                <b-btn pill variant="info" type="submit" class="px-5">
                  Log In
                </b-btn>
              </b-form>
            </validation-observer>
          </section>
        </div>
        <div class="col-md-4">
          <section class="login-page__section">
            <h2 class="login-page__section-title">
              New to Nuxt FamilyTree?
            </h2>
            <a href="mailto:nhatminh.150596@gmail.com">
              <b-btn pill variant="outline-info" class="w-100 mt-2">
                Sign up now
              </b-btn>
            </a>
          </section>
          <section class="login-page__section">
            <h2 class="login-page__section-title">
              Use my Facebook login
            </h2>
            <p>It’s easier and quicker, one less password to remember.</p>
            <b-btn pill variant="outline-info" class="w-100">
              <i class="faf fa-facebook-square mr-2"></i>
              Log in with Facebook
            </b-btn>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  components: {},
  data: () => {
    return {
      form: {
        email: '',
        password: '',
        checked: false
      }
    }
  },
  computed: {},
  mounted() {},
  methods: {
    ...mapActions({
      login: 'login'
    }),
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null
    },
    onSubmit() {
      this.login(this.form).then(async (response) => {
        if (response && response.data) {
          const responseData = response.data
          await localStorage.setItem('authFamilyTree', responseData.data)
          this.$router.push({
            path: '/'
          })
        }
      })
    },
    onReset() {
      this.form = {
        email: '',
        name: '',
        checked: []
      }
      this.$nextTick(() => {
        this.$refs.observer.reset()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './login.scss';
</style>
