<template>
 <div id="Home">
   <el-button type="info" @click.native="logout">退出</el-button>
 </div>
</template>

<script>
 export default {
   name: 'Home',
   data () {
     return {

     }
   },
   methods:{
     /* 退出事件 */
     logout(){
       window.sessionStorage.clear() //清空token
       this.$router.push('/login') //跳转登录页面
     }
   },
   components: {

   }
 }
</script>

<style  scoped>

 
</style>
