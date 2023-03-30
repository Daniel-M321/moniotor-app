<template>
    <nav class="my-header">
        <div class="row mt-4 mx-5">
            <div class="col col-lg-1"><img class="rounded-circle" height="80" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmG5p8UupmMVKs875O7bXQYyptCrL_lhnMC6YoIvjalCiN8mkKiYCtJJxFqP2RS4r7k-A&usqp=CAU" alt="Profile pic"></div>
            <div class="col pt-2 col-lg-8">
                <h3>Welcome<hr></h3>
                <a>Please enter a measurement and period for the data</a>
            </div>
            
            <div class="col pt-2 col-lg-3">
                <h5>Mobile Number Update</h5>
                <input v-on:keyup.enter=writeNumber(pnumber) v-model="pnumber" placeholder="edit me" />
                
                <p>{{ writeStatus }}</p>
            </div>
        </div>
    </nav>
    <br>
</template>

<script>
import axios from 'axios';

export default {
    name:'myHeader',
    data() {
        return {
            writeStatus: "",
            pnumber: ""
        }
    },
    methods: {
        async writeNumber(number) {
            if (number == null || number.length != 10) {
                this.writeStatus = "invalid number entered please try again"
                return null
            }
            const { data } = await axios.put('http://moniotor.eu-west-1.elasticbeanstalk.com/pnumber', null, {
                        params: {
                            apiKey: "",
                            phone_number: number
                        }
                    })

            console.log(data)
            if (data.info == "Success"){
                this.writeStatus = "Mobile number updated successfully"
            } else if (data.info == "Failure"){
                this.writeStatus = "Error, you have already updated your number in the last hour."
                return null
            } else {
                this.writeStatus = "Error updating number, please contact support."
                return null
            }
        }
    }
}
</script>

<style scoped>

.my-header { 
    border-bottom: 5px solid #2996d1;
    background-color: #f8fbfd; 
    padding: 10px; 
    color: black; 
}
.my-header a { color: black; }
</style>