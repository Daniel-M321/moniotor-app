# Moniotor

## Project setup
Run this command inside `frontend` AND `backend` directory
```
npm install
```

### Fake data for influx for testing (line protocol)
```
Temperature,location=kitchen temperature=25 1675780524
Temperature,location=kitchen temperature=28 1675780534
Temperature,location=kitchen temperature=30 1675780544
Temperature,location=kitchen temperature=24 1675780554
Temperature,location=kitchen temperature=21 1675780564
Temperature,location=kitchen temperature=26 1675780574
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
