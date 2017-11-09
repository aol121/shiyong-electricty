<template>
    <div class="wrapper">
        <v-head></v-head>

        <div class="mobile-content">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>

<script>
    import vHead from './mobileHeader.vue';

    export default {
        components:{
            vHead
        }
    }
</script>

<style type="text/css" scoped="scoped">
  .mobile-content {
    height:calc(100% - 50px);
    background: #edeef2;
    
    overflow: auto;
    -webkit-overflow-scrolling : touch; /*兼容ios上下滚动的问题*/
  }
</style>
