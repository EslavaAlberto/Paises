<template>
  <router-view />
</template>
<script>
import { defineComponent } from 'vue'
import TitleComponent from './components/TitleComponent.vue';
export default defineComponent({
  name: 'App',
  components:{
    TitleComponent,
  },
})
</script>
<style>

body {
  background-color: hsl(207, 26%, 17%);
}
</style>