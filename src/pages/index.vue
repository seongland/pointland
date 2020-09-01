<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-24">
          <v-toolbar dark flat>
            <v-toolbar-title>Stryx Account</v-toolbar-title>
          </v-toolbar>
          <v-toolbar height="dense" dark flat color="red" v-if="error">
            <v-toolbar-title>Login Fail</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                autofocus
                label="Email"
                v-model="email"
                name="login"
                prepend-icon="fas fa-user-circle"
                type="text"
              />
              <v-text-field
                label="Password"
                v-model="password"
                name="password"
                prepend-icon="fas fa-lock"
                type="password"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="$router.push(`/signup`)"> Singup </v-btn>
            <v-btn @click="onSubmit(email, password)"> Login </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const STRATEGY = 'local'
const CTT_JSON = {
  headers: {
    'Content-Type': 'application/json'
  }
}

export default {
  layout: 'before',
  middleware: 'authentication',
  data() {
    return {
      email: undefined,
      password: undefined,
      error: undefined
    }
  },
  methods: {
    async onSubmit(email, password) {
      const loginData = JSON.stringify({ strategy: STRATEGY, email, password })
      const res = await this.$axios
        .post('/api/authentication', loginData, CTT_JSON)
        .catch(() => {
          this.error = true
        })
      if (!res) return
      this.$store.commit('localStorage/login', res.data.accessToken)
      this.$router.push(`/map`)
    }
  }
}
</script>
