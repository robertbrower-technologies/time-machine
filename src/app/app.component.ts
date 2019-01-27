import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { TimeMachineComponent } from './time-machine/time-machine/time-machine.component';
import { TimeMachineContent } from './time-machine/time-machine-content';
import { TimeMachineContentActiveEvent } from './time-machine/time-machine-content-active-event';
import { TimeMachineContentVisibleEvent } from './time-machine/time-machine-content-visible-event';
import { TimeMachineInitContentEvent } from './time-machine/time-machine-init-content-event'
import { TimeMachineTransformContentEvent } from './time-machine/time-machine-transform-content-event';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  MAX_DATA_OBJECTS = 100;

  data = new Array<any>();

  activeIndex;

  translateX = -200;

  translateY = -200;

  translateZ = -1000;

  rotateX = -90;

  maxTranslateZ = -5000;

  // Optionally use ViewChild to get a reference to the time machine and call it's functions.
  // @ViewChild("timeMachine") timeMachine: TimeMachineComponent;

  boundTrackByFn: Function;
  
  ngOnInit() {
    this.boundTrackByFn = this.trackByFn.bind(this);
    let data = new Array<any>();
    for (let i = 0; i < this.MAX_DATA_OBJECTS; i++) {
      data.push(
        {
          id: i + 1,
          imgSrc: '',
          visibleImgSrc: './assets/images/robertbrower.jpg'
        }
      );
    }
    this.data = data;
  }

  // Track by the data id.
  trackByFn(index: number, content: TimeMachineContent) {
    return content.data.id;
  }

  // Initialize the content with a custom sinusoidal behavior.
  initContent(event: TimeMachineInitContentEvent) {
    event.content.translateZ = event.index * this.translateZ;
    event.content.translateX = Math.sin(event.content.translateZ) * 1000;
    event.content.translateY = Math.sin(event.content.translateZ) * 500;
    event.content.rotateX = 0;
  }

  // Transform the content with a custom sinusoidal behavior.
  transformContent(event: TimeMachineTransformContentEvent) {
    event.content.translateZ += event.delta * this.translateZ;
    event.content.translateX = Math.sin(event.content.translateZ) * 1000;
    event.content.translateY = Math.sin(event.content.translateZ) * 500;
    event.content.rotateX = event.content.translateZ > 0 ? this.rotateX : 0;
  }
  
  // Capture the active index for the slider.
  contentActive(event: TimeMachineContentActiveEvent) {
    if (event.content.active) {
      // Use setTimeout() to avoid ExpressionChangedAfterItHasBeenCheckedError with slider
      setTimeout(() => this.activeIndex = event.content.index);
    }
  }

  // Defer setting the img src attribute until the content is visible.
  contentVisible(event: TimeMachineContentVisibleEvent) {
    if (event.content.visible && event.content.data.imgSrc === '') {
      event.content.data.imgSrc = `${event.content.data.visibleImgSrc + '?ts=' + (new Date()).getTime()}`;
    }
  }

  // Capture the slider index for the time machine.
  sliderChange(event: MatSliderChange) {
    // Optionally use ViewChild to get a reference to the time machine and call it's functions.
    // this.timeMachine.setActive(event.value);
    this.activeIndex = event.value;
  }

}
