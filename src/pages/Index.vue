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
        <span v-for="(value, time) in selectedTabData.whenItRing" :key="time"
          >{{ time }}<br
        /></span>
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
      tabs: []
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
  methods: {
    addNewTab() {
      this.tabs.push({
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
