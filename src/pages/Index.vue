<template>
  <q-page class="q-pa-md">
    <div class="row justify-content-center">
      <div class="text-purple q-gutter-md cursor q-mb-md">
        <q-icon size="xl" name="alarm_add" @click="addNewTab" />
      </div>
    </div>
    <q-tabs v-model="tab" shrink stretch>
      <q-tab
        :name="`key${key}`"
        :label="`${value.name || `Tab ${key}`}`"
        v-for="(value, key) in tabs"
        :key="key"
      />
    </q-tabs>

    <div class="row" v-if="tab">
      <div class="col-6">
        <p v-for="(value, time) in this.selectedTabData.whenItRing" :key="time" class="no-margin">
          {{ renderTime(time) }}
          <q-icon
            size="sm"
            :name="value ? 'done' : 'close'"
            :class="value ? 'text-green' : 'text-black'"
          />
        </p>
      </div>
      <div class="col-6 q-gutter-sm">
        <q-input
          v-model="selectedTabData.name"
          label="Tab name"
        />
        <q-input
          v-model.number="selectedTabData.workStart"
          type="number"
          label="Starting work at"
        />
        <q-input
          v-model.number="selectedTabData.workTime"
          type="number"
          label="Work time in hours"
        />
        <q-input
          v-model.number="selectedTabData.intervalTime"
          type="number"
          label="Interval in minutes"
        />
        <q-btn
          color="white"
          text-color="black"
          :label="!selectedTabData.status ? 'start' : 'stop'"
          @click="startWork(selectedTabKey)"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageIndex",
  data() {
    return {
      tab: null,
      tabs: this.$electronStore.get('tabs') || []
    };
  },
  computed: {
    selectedTabData() {
      return this.tabs[this.selectedTabKey];
    },
    selectedTabKey() {
      return this.tab.slice(3);
    }
  },
  watch: {
    tabs: {
      deep: true,
      handler() {
        console.log('changed');
        this.$electronStore.set('tabs', this.tabs)
      }
    }
  },
  methods: {
    addNewTab() {
      this.tabs.push({
        name: `Tab ${this.tabs.length + 1}`,
        status: false,
        workStart: null,
        workTime: 8,
        intervalTime: 20,
        intervalId: null,
        whenItRing: {}
      });
    },
    startWork(key) {
      const data = this.tabs[key];
      if (data.workStart === null) {
        return this.$q.notify("Empty workStart");
      }

      if (data.workStart < 0 || data.workStart >= 24) {
        return this.$q.notify("This field must be between 0 and 23");
      }

      data.status = !data.status;

      if (data.status) {
        const date = new Date();
        date.setHours(data.workStart, 0, 0, 0);
        let startingToWorkAt = date.getTime();
        let copyStartingToWorkAt = startingToWorkAt;
        data.whenItRing = {};

        for (
          let i = 0;
          startingToWorkAt <=
          copyStartingToWorkAt + data.workTime * 60 * 60 * 1000;
          i++
        ) {
          data.whenItRing[startingToWorkAt] = Date.now() > startingToWorkAt;
          startingToWorkAt = startingToWorkAt + data.intervalTime * 60 * 1000;
        }

        this.tabs[key].whenItRing = data.whenItRing;

        this.tabs[key].intervalId = setInterval(() => {
          const times = Object.entries(
            this.tabs[key].whenItRing
          ).filter(data => !data[1])

          // times ended on this date
          if (!times[0]) {
            return
          }

          const closeNextRing = times[0][0];
          if (new Date().getTime() >= parseInt(closeNextRing)) {
            const whenItRing = this.tabs[key].whenItRing
            whenItRing[closeNextRing] = true
            this.$set(this.tabs, key, Object.assign({}, this.tabs[key], whenItRing ))
            this.notificationTest("Its time to chill, bro!");
          }
        }, 1000);
      } else {
        clearInterval(this.tabs[key].intervalId);
        this.tabs[key].intervalId = null;
      }
    },
    renderTime(time) {
      const date = new Date(+time);
      return `${date
        .getHours()
        .toString()
        .padStart(2, 0)}:${date
        .getMinutes()
        .toString()
        .padStart(2, 0)}`;
    },
    notificationTest(text) {
      if (process.env.MODE === "electron") {
        const notification = new this.$q.electron.remote.Notification({
          title: "Application",
          body: text
        });

        notification.show();

        const audio = new Audio(
          "https://ccrma.stanford.edu/~jos/mp3/gtr-wah.mp3"
        );
        audio.volume = 0.5;
        audio.play();
      }
    }
  }
};
</script>
