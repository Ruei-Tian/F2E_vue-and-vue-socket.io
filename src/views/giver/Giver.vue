<template>
<div class="giver-wrap">  
    <nav>
        <router-link to="/">回首頁</router-link> ｜
        <router-link to="/giver">設定時段</router-link> ｜
        <router-link :class="{active: isActive('myBooking')}" to="/giver/myBooking">我的預約</router-link>
    </nav>
    <router-view></router-view>
   
</div>
</template>

<script>
export default {
    name: 'Giver',
    data() {
        return {
           
        }
    },
    methods: {
        isActive(str) {
            let ifRouteMatch = this.$route.path.indexOf(str);
            if(ifRouteMatch !== -1) {
                return true;
            } else {
                return false
            }
        }
    }

}
</script>