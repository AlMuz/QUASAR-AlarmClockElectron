import Vue from 'vue'

const Store = require('electron-store');
const store = new Store();

Vue.prototype.$electronStore = store
