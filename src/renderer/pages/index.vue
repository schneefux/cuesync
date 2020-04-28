<template>
  <div>
    <system-information />
    <cv-button @click="openURL('https://github.com/michalzaq12/electron-nuxt')">
      Github
    </cv-button>
    <cv-button @click="openURL('https://nuxtjs.org/guide')">
      Nuxt.js
    </cv-button>
    <cv-button @click="openURL('https://electronjs.org/docs')">
      Electron.js
    </cv-button>
    <cv-text-input label="Who are you?" v-model="yourName" placeholder="your name" />
    <cv-button @click="onClick">Hello {{yourName}}</cv-button>
    <cv-modal :visible="visible" @modal-hidden="modalClosed">
      <template slot="title">Welcome to @carbon/vue {{yourName}}</template>
      <template slot="content">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, seed do eiusmod tempor incididunt ut labore et
          dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </p>
      </template>
    </cv-modal>
  </div>
</template>

<script>
import { remote } from 'electron'
import SystemInformation from '@/components/SystemInformation.vue'

export default {
  components: {
    SystemInformation
  },
  data () {
    return {
      externalContent: '',
      yourName: '',
      visible: false,
    }
  },
  methods: {
    openURL (url) {
      remote.shell.openExternal(url)
    },
    onClick() {
      this.visible = true;
    },
    modalClosed() {
      this.visible = false;
    },
  },
}
</script>
