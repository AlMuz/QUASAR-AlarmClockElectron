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
      <q-page class="q-pa-md">
        <div class="row">
          <div class="col-6">
            <p v-for="time in whenItRing" :key="time">{{ time }}</p>
          </div>
          <div class="col-6">
            <q-input v-model="workStart" label="Starting work at" />
            <q-input v-model="workTime" label="Work time in hours" />
            <q-input v-model="intervalTime" label="Interval in minutes" />
            <div class="row">
              <q-btn
                color="white"
                text-color="black"
                :label="!status ? 'start' : 'stop'"
                @click="startWork"
              />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  data() {
    return {
      status: false,
      workStart: "",
      workTime: 8,
      intervalTime: 15,
      intervalId: null,
      whenItRing: []
    };
  },
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
    },
    notificationTest(item) {
      if (this.isElectron) {
        const notification = new this.$q.electron.remote.Notification({
          title: "Application",
          body: item
        });

        notification.onclick = () => {
          console.log("Notification clicked");
        };

        notification.show();
      }
    },
    startWork() {
      this.status = !this.status;

      if (this.status) {
        if (!this.workStart) {
          this.status = false;
          return this.$q.notify("Empty workStart");
        }

        let startingToWorkAt = parseInt(this.workStart) * 60;

        for (
          var i = 0;
          startingToWorkAt <
          (parseInt(this.workStart) + parseInt(this.workTime)) * 60;
          i++
        ) {
          var hh = Math.floor(startingToWorkAt / 60);
          var mm = startingToWorkAt % 60;
          this.whenItRing[i] =
            ("0" + hh).slice(-2) + ":" + ("0" + mm).slice(-2);
          startingToWorkAt = startingToWorkAt + this.intervalTime;
        }

        console.log(this.whenItRing);
        // this.intervalId = setInterval(() => {
        //   this.notificationTest(1);
        // }, 1000);
      } else {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
  }
};
</script>
