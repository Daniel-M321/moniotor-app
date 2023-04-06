# Moniotor

## Project setup
Run this command inside `frontend` AND `backend` directory
```
npm install
```

### Fake data for influx for testing (line protocol)
```
CO,location=Kitchen co=19 1679662592
CO,location=Kitchen co=26 1679661592
CO,location=Kitchen co=27 1679660592
CO,location=Kitchen co=30 1679659592
CO,location=Kitchen co=34 1679658592
CO,location=Kitchen co=30 1679657592
CO,location=Kitchen co=32 1679656592
CO,location=Kitchen co=29 1679655592
CO,location=Kitchen co=26 1679654592
CO,location=Kitchen co=29 1679653592
CO,location=Kitchen co=35 1679652592
CO,location=Kitchen co=27 1679651592
CO,location=Kitchen co=26 1679650592
CO,location=Kitchen co=27 1679649592
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
