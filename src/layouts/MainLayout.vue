<template>
  <q-layout view="lHh lpr lFf">
    <q-header elevated v-if="isElectron">
      <q-bar class="q-electron-drag">
        <q-icon name="laptop_chromebook" />
        <div>Testing</div>

        <q-space />

        <q-btn dense flat icon="minimize" @click="minimize" />
        <q-btn dense flat icon="crop_square" @click="maximize" />
        <q-btn dense flat icon="close" @click="closeApp" />
      </q-bar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  computed: {
    isElectron() {
      return process.env.MODE === "electron";
    }
  },
  methods: {
    minimize() {
      if (this.isElectron) {
        console.log(this.$q.electron.remote.BrowserWindow.getFocusedWindow());
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().hide();
      }
    },
    maximize() {
      if (this.isElectron) {
        const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow();
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      }
    },
    closeApp() {
      if (this.isElectron) {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().close();
      }
    }
  }
};
</script>
