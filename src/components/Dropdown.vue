<template>
    <v-menu bottom open-on-hover offset-y origin="center center" transition="scale-transition">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" text>{{ name }}</v-btn>
      </template>
      <v-list dark>
        <v-list-item v-for="(item, index) in items" :key="index" :href="item.href" :to="item.to">
          <v-list-item-title >{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: "Dropdown Menu"
    },
    items: {
      default: []
    }
  }
};
</script>

<style scoped>
</style>