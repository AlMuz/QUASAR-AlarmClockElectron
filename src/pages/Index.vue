<template>
  <q-page class="q-pa-md">
    <div class="row justify-content-center">
      <div class="text-purple q-gutter-md">
        <q-icon size="xl" name="alarm_add" @click="addNewTab" />
      </div>
    </div>
    <q-tabs v-model="tab" shrink stretch>
      <q-tab
        :name="`key${key}`"
        :label="`Tab ${key}`"
        v-for="(value, key) in tabs"
        :key="key"
      />
    </q-tabs>

    <div class="row" v-if="tab">
      <div class="col-6">
        <span v-for="time in selectedTabData.whenItRing" :key="time">{{ time }}<br /></span>
      </div>
      <div class="col-6">
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
        <div class="row">
          <q-btn
            color="white"
            text-color="black"
            :label="!selectedTabData.status ? 'start' : 'stop'"
            @click="startWork(selectedTabKey)"
          />
        </div>
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
      tabs: [],
    };
  },
  computed: {
    selectedTabData() {
      return this.tabs[this.selectedTabKey]
    },
    selectedTabKey() {
      return this.tab.slice(3)
    }
  },
  methods: {
    addNewTab() {
      this.tabs.push({
          status: false,
          workStart: null,
          workTime: 8,
          intervalTime: 20,
          intervalId: null,
          whenItRing: []
        });
    },
    startWork(key) {
      const data = this.tabs[key]
      if (data.workStart === null) {
        return this.$q.notify("Empty workStart");
      }

      if (data.workStart < 0 || data.workStart >= 24) {
        return this.$q.notify("This field must be between 0 and 23");
      }

      data.status = !data.status;

      if (data.status) {
        let startingToWorkAt = data.workStart * 60;
        data.whenItRing = [];

        for (
          let i = 0;
          startingToWorkAt <= (data.workStart + data.workTime) * 60;
          i++
        ) {
          let hh = Math.floor(startingToWorkAt / 60);
          let mm = startingToWorkAt % 60;
          data.whenItRing[i] =
            ("0" + hh).slice(-2) + ":" + ("0" + mm).slice(-2);
          startingToWorkAt = startingToWorkAt + data.intervalTime;
        }

        // use date now
        // timestamp increment

        // this.intervalId = setInterval(() => {
        //   this.notificationTest(1);
        // }, 1000);
      } else {
        // clearInterval(this.intervalId);
        // this.intervalId = null;
      }
    }
  }
};
</script>
