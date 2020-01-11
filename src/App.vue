<template>
  <div id="app">
    <v-app>
      <header>
          <v-toolbar dark>
            <v-spacer></v-spacer>
            <v-avatar size="60" tile>
              <v-img src="/logo.png"> 
              </v-img>
            </v-avatar>
            <v-btn to="/" text>
              <v-toolbar-title>DERO Explorer</v-toolbar-title>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field
              hide-details
              prepend-icon="search"
              single-line
              label = "Block height, block hash, transaction hash"
              v-model="search"
            ></v-text-field>
            <v-btn @click="searchFunc()" text>Search</v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn href="https://dero.io" text>Home</v-btn>
              <v-btn href="https://wallet.dero.io" text>Web Wallet</v-btn>
              <dropdown name="Stats" :items="this.statsItems"></dropdown>
            <v-btn @click="changeTheme()" dark text><span><v-icon dark>invert_colors</v-icon></span></v-btn>
            </v-toolbar-items>
            <v-spacer></v-spacer>
          </v-toolbar>
        </header>

        <v-content>
            <transition name="fade">
              <router-view></router-view>
            </transition>
        </v-content>
        <v-footer elevation="10" padless>
          <v-card
            flat
            tile
            width="100%"
            dark
            class="text-center"
          >
            <v-card-text>
              dERokevAZEZVJ2N7o39VH81BXBqX9ojtncnPTDMyiVbmYiTXQY93AUCLcor9xsWCKWhYy25ja89ikZWXWab9kXRB7LYfUmbQyS
            </v-card-text>
            <v-divider></v-divider>
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
import * as explorer from './explorer'

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
        }/*,
        {
          title: "Stats",
          to: "/stats"
        }*/
      ],
      menu: [
        { icon: 'home', title: 'Link A' },
        { icon: 'info', title: 'Link B' },
        { icon: 'warning', title: 'Link C' }
      ],
      search: "",
      menuMobile: false
    }
  },
  mounted() {
    if (localStorage.theme) {
      this.$vuetify.theme.dark = localStorage.theme == "dark"
    } else {
      this.$vuetify.theme.dark = true
    }
  },
  methods: { /* eslint-disable no-console */
    async searchFunc() {
        if (this.search) {
            let block = await explorer.loadBlock(this.search)
            if (block && (block.block_header.hash === this.search || block.block_header.topoheight === parseInt(this.search))) {
                this.$router.push('/block/' + this.search)
            }
            else if (this.search.length == 64) {
              let tx = explorer.loadTxs(this.search)
              // TODO, fix loadTxs first.
              if (tx && tx.status != "TX NOT FOUND") {
                this.$router.push('/tx/' + this.search)
              }
              else {
                alert("This transaction doesn't exist!")
              }
            }
            else {
              alert("Incorrect format, please specify a block height, or a block hash, or a transaction hash.")
            }
        }
      },
      changeTheme() {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark

        if (this.$vuetify.theme.dark) {
          localStorage.theme = "dark"
          document.getElementById("app").style.color = "black"
        } else {
          localStorage.theme = "light"
          document.getElementById("app").style.color = "#2c3e50"
        }
      }
    }
}
</script>

<style>
#app {
  text-align: center;
  color: white;
}

* {
    transition: background-color 200ms ease, color 150ms ease-in-out;
}

.title-color {
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

@media screen and (max-width: 960px)
{

}
</style>
