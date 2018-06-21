import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { UserService } from '../../services/user';
import { Inject } from '../../util/injector';
import { GuestApiService } from 'services/guest-api';
import { FacemasksService } from 'services/facemasks';
import { I18nService } from 'services/i18n';
import electron from 'electron';

@Component({})
export default class Dashboard extends Vue {
  @Inject() userService: UserService;
  @Inject() guestApiService: GuestApiService;
  @Inject() facemasksService: FacemasksService;
  @Inject() i18nService: I18nService;
  @Prop() params: Dictionary<string>;

  $refs: {
    dashboard: Electron.WebviewTag;
  };

  mounted() {
    this.guestApiService.exposeApi(this.$refs.dashboard, {
      testAudio: this.testAudio,
      getStatus: this.getStatus,
      getDevices: this.getDevices,
      enableMask: this.enableMask,
      updateSettings: this.updateSettings,
    });
    this.i18nService.setWebviewLocale(this.$refs.dashboard);
    this.$refs.dashboard.addEventListener('new-window', e => {
      electron.remote.shell.openExternal(e.url);
    });
  }

  get loggedIn() {
    return this.userService.isLoggedIn();
  }

  get dashboardUrl() {
    return this.userService.dashboardUrl(this.params.subPage || '');
  }

  async getStatus() {
    return this.facemasksService.getDeviceStatus();
  }

  async getDevices() {
    return this.facemasksService.getInputDevicesList();
  }

  async enabledDevice() {
    return this.facemasksService.getEnabledDevice();
  }

  async enableMask(uuid: string) {
    return this.facemasksService.enableMask(uuid);
  }

  async updateSettings(settings: any) {
    return this.facemasksService.updateSettings(settings);
  }

  async testAudio(volume: number) {
    return this.facemasksService.playTestAudio(volume);
  }
}
