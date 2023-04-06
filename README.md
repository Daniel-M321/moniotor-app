# Moniotor

## Project setup
Run this command inside `frontend` AND `backend` directory
```
npm install
```

### Fake data for influx for testing (line protocol)
```
Humidity,location=Kitchen humidity=17 1679662592
Humidity,location=Kitchen humidity=17 1679661592
Humidity,location=Kitchen humidity=17 1679660592
Humidity,location=Kitchen humidity=17 1679659592
Humidity,location=Kitchen humidity=17 1679658592
Humidity,location=Kitchen humidity=17 1679657592
Humidity,location=Kitchen humidity=17 1679656592
Humidity,location=Kitchen humidity=17 1679655592
Humidity,location=Kitchen humidity=17 1679654592
Humidity,location=Kitchen humidity=17 1679653592
```
Make sure to update timestamps if needed.

**If just testing frontend Run these commands in frontend directory.**
### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

**Else just run ```docker compose up``` at root**

## N.B. If running locally
Need to change axios.get() url to "http://localhost/api", in ```src\components\myChart.vue``` line 76. Check `nginx` folder if lost. And uncomment "local" section in compose file or use compose in `docker_dev`

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
