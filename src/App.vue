<template>
  <div id="app">
    <v-app>
      <header>
          <v-toolbar dark>
            <v-toolbar-side-icon>
              <v-img src="/logo.png" height="50px" width="50px"> 
              </v-img>
            </v-toolbar-side-icon>
            <v-toolbar-title>DERO Explorer</v-toolbar-title>
            <v-spacer></v-spacer>
                  <v-text-field
              hide-details
              prepend-icon="search"
              single-line
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
              <v-btn to="/products" text>Home</v-btn>
              <v-btn href="http://stats.dero.io" text>Web Wallet</v-btn>
              <v-btn href="http://stats.dero.io" text>Stats</v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </header>

        <v-content>
            <transition name="fade">
              <router-view></router-view>
            </transition>
        </v-content>
      </v-app>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  }
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
