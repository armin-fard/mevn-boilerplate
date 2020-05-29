<template>
  <v-app id="inspire">

    <v-theme-provider root>
      <v-navigation-drawer
        width="11.5rem"
        app
        v-model="drawer"
        hide-overlay
        fixed
        permanent
        expand-on-hover
      >
        <v-layout v-if="this.$vuetify.theme.dark" elevation-3 style="padding: 0.7rem 0rem 0.5rem 0rem" column align-center justify-center>
          <img width="50%" height="30%" src="./assets/codex2.png">
        </v-layout>
        <v-layout v-else elevation-3 style="padding: 0.7rem 0rem 0.5rem 0rem" column align-center justify-center>
          <img width="50%" height="30%" src="./assets/codex-light.png">
        </v-layout>
        <v-list dense>
          <v-list-item @click="linkTitle = link.link" v-for="(link, key) in navLinks" :key="key" :to="link.route" link>
            <v-list-item-action>
              <v-icon color="accent">{{ link.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ link.link }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-icon color="error">mdi-power</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-theme-provider>

    <v-app-bar app dense>
      <v-col cols="11">
        <v-toolbar-title class="link-title">
          {{ linkTitle }}
        </v-toolbar-title>
      </v-col>
      <v-col cols="1">
        <v-menu 
          offset-y       
          origin="center center"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on }">
              <v-icon style="margin-left: 1rem" v-on="on" color="accent">mdi-brightness-6</v-icon>
          </template>
          <v-list>
            <v-list-item
              v-for="(theme, index) in themes"
              :key="index"
              @click="toggleTheme(theme)"
            >
              <v-list-item-title>{{ theme }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <v-layout style="display: flex; justify-content: center; align-items: center">
          <v-flex>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; JLM Strategic Talent Partners - 2020</span>
    </v-footer>

  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
      theme: 'Dark',
      themes: ['Light', 'Dark'],
      themeSelection: false,
      drawer: true,
      linkTitle: '',
      navLinks: 
      [
        {
          link: 'Dashboard',
          route: '/',
          icon: 'mdi-view-dashboard'
        },
        {
          link: 'Invoices',
          route: '/invoices',
          icon: 'mdi-google-spreadsheet'
        },
        {
          link: 'Clients',
          route: '/clients',
          icon: 'mdi-briefcase-account-outline'
        },
        {
          link: 'Reports',
          route: '/reports',
          icon: 'mdi-chart-bar'
        },
        {
          link: 'Settings',
          route: 'settings',
          icon: 'mdi-cogs'
        }
      ]        
    }),
    methods: {
      toggleTheme (theme) {
        this.theme = theme
        this.theme === 'Dark' ? this.$vuetify.theme.dark = true : (this.$vuetify.theme.light = true, this.$vuetify.theme.dark = false)
      }
    },
    created () {
      this.theme === 'Dark' ? this.$vuetify.theme.dark = true : this.$vuetify.theme.light = true
      if (this.$router.currentRoute.path === '/') {
        this.linkTitle = 'Dashboard'
      } else {
        this.linkTitle = this.$router.currentRoute.path.split('/')[1]
      }
    },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Lora');
* {
  box-sizing: border-box !important;
}
.btn {
  margin: 0.3rem 0.3rem 0rem 0.3rem;
}
.link-title {
  text-transform: capitalize;
}
.clickable-card {
  display: flex;
  justify-content: center;
  align-content: center;
  border-radius: 1rem;
  margin: 1rem;
}
.clickable-card:hover {
  cursor: pointer;
}
</style>
