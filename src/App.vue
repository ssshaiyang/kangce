<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import {mapMutations} from 'vuex';

export default {
    name: 'app'
};
</script>

<style>
body,
html {
    width: 100%;
    height: 100%;
}
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}
#app {
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>