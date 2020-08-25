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
      <div class="q-pa-sm q-pl-md row items-center">
        <div class="cursor-pointer non-selectable">
          {{ $t("settings") }}
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item clickable>
                <q-item-section>{{ $t("languages") }}</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>

                <q-menu anchor="top right" self="top left">
                  <q-list>
                    <q-item
                      v-for="(value, key) in langOptions"
                      :key="key"
                      dense
                      clickable
                      v-close-popup
                    >
                      <q-item-section @click="changeLanguage(value.lang)">{{
                        value.label
                      }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
              <q-item clickable v-close-popup @click="clearData">{{
                $t("clearAllData")
              }}</q-item>

              <q-separator />

              <q-item clickable v-close-popup>
                <q-item-section>{{ $t("quit") }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  created() {
    this.$i18n.locale = this.$electronStore.get("locale") || "en-us";
  },
  data() {
    return {
      lang: this.$electronStore.get("locale"),
      langOptions: [
        { lang: "en-us", label: "English" },
        { lang: "ru", label: "Russian" }
      ]
    };
  },
  watch: {
    lang(language) {
      this.$i18n.locale = language;
      this.$electronStore.set("locale", language);
    }
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
    changeLanguage(language) {
      this.lang = language;
    },
    clearData() {
      this.$electronStore.clear();
      this.$q.electron.remote.BrowserWindow.getFocusedWindow().reload();
    }
  }
};
</script>
