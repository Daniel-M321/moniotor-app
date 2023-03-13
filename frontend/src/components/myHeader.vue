<template>
    <div class="row mt-4 mx-5">
        <div class="col col-lg-1 col-sm-12"><img class="rounded-circle" height="80" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmG5p8UupmMVKs875O7bXQYyptCrL_lhnMC6YoIvjalCiN8mkKiYCtJJxFqP2RS4r7k-A&usqp=CAU" alt="Profile pic"></div>
        <div class="col pt-2 col-lg-6 col-6 col-md-12">
            <h3>Welcome</h3>
            <p class="text-muted">Please enter a measurement and period for the data</p>
        </div>
        <div class="col float-right col-lg-4 mt-lg-5 mb-lg-3 my-md-2">
            <h3>Mobile Number Update</h3>
            <input v-model="period" placeholder="edit me" />
            <button @click="writeNumber(selected)"> Update</button>

            <p>{{ writeStatus }}</p>
            <!-- <div class="row">
                <small class="col today active">Today</small>
                <small class="col compared text-muted disabled">compared to</small>
                <small class="col previous">Previous Period</small>
            </div> -->
        </div> -->
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name:'myHeader',
    data() {
        return {
            writeStatus: ""
        }
    },
    methods: {
        async writeNumber() {
            const { data } = await axios.put('http://localhost/api', {
                        params: {
                        }
                    })

            if (data == "Success"){
                this.writeStatus = "Mobile number updated successfully"
            } else {
                this.writeStatus = "Error updating number, please contact support."
            }
        }
    }
}
</script>

<style scoped>
.today, .previous, .compared{
    border: 1px solid #9b9b9b9f;
    border-radius: 15px;
    text-align: center;
    padding: 5px;
}
.compared{
    border: none;
}
</style>