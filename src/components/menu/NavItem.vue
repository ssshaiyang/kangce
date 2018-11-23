<!-- 菜单递归 -->
<template>
    <!-- 有子节点 -->
    <el-submenu v-if="menuItem.children && menuItem.children.length" :index="menuIndex + ''"  >
        <template slot="title">
            <i v-if="menuItem.icon" :class="menuItem.icon"></i>
            <span>{{menuItem.name}}</span>
        </template>
        <!-- <nav-item v-for="(item, index) in menuItem.children" :key="`${menuIndex}-${index}`" :menuItem="item" :menuIndex="`${menuIndex}-${index}`" >
        </nav-item> -->
        <nav-item v-for="item in menuItem.children" :key="item.id + ''" :menuItem="item" :menuIndex="item.id" >
        </nav-item>
    </el-submenu>
    <!-- 没有子节点 -->
    <el-menu-item v-else :index="menuIndex + ''">
        <i v-if="menuItem.icon" :class="menuItem.icon"></i>
        {{menuItem.name}}
    </el-menu-item>
</template>

<script>
export default {
  name:'NavItem',
  data(){
    return {
    };
  },
  props: {
    menuItem: {
        required: true,
        type: Object,
    },
    menuIndex: {
        required: true,
    },
  }
}
</script>

<style scoped>

</style>