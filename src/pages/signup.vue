<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-24" shaped>
          <v-toolbar dark flat>
            <v-toolbar-title>Stryx Account</v-toolbar-title>
          </v-toolbar>
          <v-toolbar height="dense" dark flat color="red" v-if="error">
            <v-toolbar-title>Signup Fail</v-toolbar-title>
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
              <v-text-field label="Password" v-model="password" name="password" prepend-icon="fas fa-lock" type="password" />
              <v-text-field label="Name" v-model="name" name="name" prepend-icon="fas fa-signature" type="name" />
              <v-text-field
                label="Description"
                v-model="description"
                name="description"
                prepend-icon="fas fa-book"
                type="description"
                @keydown.enter="onSubmit(email, password, name, description)"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" @click="onSubmit(email, password, name, description)">
              Singup
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const PROJECT = { id: '849661cb-65cf-46ff-8345-6afdf162d090' }
const ORGANIZATION = { id: '21faef0d-5af5-485d-9c3f-f76462fdb1fd' }
const CTT_JSON = {
  headers: {
    'Content-Type': 'application/json'
  }
}

export default {
  layout: 'before',
  middleware: 'authentication',
  data: () => ({
    email: undefined,
    password: undefined,
    name: undefined,
    description: undefined,
    error: undefined
  }),
  methods: {
    async onSubmit(email, password, name, description) {
      const signUpData = JSON.stringify({ email, password, description, name, projects: [PROJECT], org: ORGANIZATION })
      const res = await this.$axios.post('/api/user', signUpData, CTT_JSON).catch(() => {
        this.error = true
      })
      if (!res) return
      this.$router.push(`/`)
    }
  }
}
</script>
