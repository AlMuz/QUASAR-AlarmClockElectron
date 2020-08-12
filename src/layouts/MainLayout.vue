<template>
  <q-layout view="lHh lpr lFf">
    <q-header elevated>
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
      <q-page class="q-pa-md">
        <p v-for="n in 15" :key="n">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil
          praesentium molestias a adipisci, dolore vitae odit, quidem
          consequatur optio voluptates asperiores pariatur eos numquam rerum
          delectus commodi perferendis voluptate?
        </p>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  methods: {
    minimize() {
      if (process.env.MODE === "electron") {
        console.log(this.$q.electron.remote.BrowserWindow.getFocusedWindow());
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().hide();
      }
    },
    maximize() {
      if (process.env.MODE === "electron") {
        const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow();
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      }
    },
    closeApp() {
      if (process.env.MODE === "electron") {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().close();
      }
    }
  }
};
</script>
