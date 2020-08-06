<template>
    <div class="my-booking-wrap">
        <div class="side-bar">
            <ul class="list">
                    <li class="item"><router-link :to="{name: 'UnBooked'}">未預約</router-link></li>
                    <li class="item"><router-link :to="{name: 'Booked'}">已預約</router-link></li>
                    <li class="item"><router-link :to="{name: 'ToBeConfirmed'}">待確認</router-link></li>
                    <li class="item"><router-link :to="{name: 'Canceled'}">已取消</router-link></li>
                    <li class="item"><router-link :to="{name: 'Done'}">已結束</router-link></li>
                </ul>
        </div>

        <router-view></router-view>
    </div>

</template>

<script>
export default {
    name: 'GiverBooking'
}
</script>

<style lang="scss">
ul {
    list-style: none;
    display: flex;
    li {
        flex: 1;
    }
}
</style>