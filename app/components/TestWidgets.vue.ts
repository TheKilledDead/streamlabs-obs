import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { WidgetsService } from 'services/widgets';
import { FacemasksService } from 'services/facemasks';
import { Inject } from '../util/injector';

@Component({})
export default class TestWidgets extends Vue {

  @Inject() widgetsService: WidgetsService;
  @Inject() facemasksService: FacemasksService;

  slideOpen = false;

  get widgetTesters() {
    return this.widgetsService.getTesters();
  }

  get facemasksActive() {
    return this.facemasksService.active;
  }

  playTestFacemask() {
    this.facemasksService.playTestAlert();
  }
}
