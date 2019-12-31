<template>
  <div id="app">
    <v-app>
      <header>
          <v-toolbar dark>
            <v-spacer></v-spacer>
            <v-toolbar-side-icon>
              <v-img src="/logo.png" height="60px" width="60px"> 
              </v-img>
            </v-toolbar-side-icon>
            <v-btn to="/" text>
              <v-toolbar-title>DERO Explorer</v-toolbar-title>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field
              hide-details
              prepend-icon="search"
              single-line
              label = "Block height, block hash, transaction hash"
            ></v-text-field>
            <v-btn to="/search" text>Search</v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
              <v-btn href="https://dero.io" text>Home</v-btn>
              <v-btn href="https://wallet.dero.io" text>Web Wallet</v-btn>
              <dropdown name="Stats" :items="this.statsItems"></dropdown>
            </v-toolbar-items>
            <v-spacer></v-spacer>
          </v-toolbar>
        </header>

        <v-content>
            <transition name="fade">
              <router-view></router-view>
            </transition>
        </v-content>

        <v-footer padless>
          <v-card
            flat
            tile
            width="100%"
            dark
            class="text-center"
          >
            <!--<v-card-text> 
              <v-btn
                v-for="icon in icons"
                :key="icon"
                class="mx-4"
                icon
              >
                <v-icon size="24px">{{ icon }}</v-icon>
              </v-btn>
            </v-card-text>

            <v-divider></v-divider>-->

            <v-card-text class="white--text">
              {{ new Date().getFullYear() }} — <strong>DERO Explorer</strong>
            </v-card-text>
          </v-card>
        </v-footer>
      </v-app>
  </div>
</template>

<script>
import dropdown from './components/Dropdown'

export default {
  name: 'app',
  components: {
    dropdown
  },

  data() {
    return {
      statsItems: [
        {
          title: "Modern Stats",
          href: "http://stats.dero.io"
        },
        {
          title: "Retro Stats",
          href: "https://network.dero.io"
        }
      ]
    }
  },
}
</script>

<style>
#app {
  text-align: center;
  color: #2c3e50;
}

.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.4s;
}

.fade-enter-active {
  transition-delay: 0.4s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
