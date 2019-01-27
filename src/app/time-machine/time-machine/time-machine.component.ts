import { Component, ContentChild, EventEmitter, HostListener, Input, OnInit, Output, TemplateRef } from '@angular/core';

import { TimeMachineContent } from '../time-machine-content';
import { TimeMachineContentActiveEvent } from '../time-machine-content-active-event';
import { TimeMachineContentDirective} from '../time-machine-content.directive';
import { TimeMachineContentVisibleEvent } from '../time-machine-content-visible-event';
import { TimeMachineInitContentEvent } from '../time-machine-init-content-event';
import { TimeMachineTransformContentEvent } from '../time-machine-transform-content-event';

@Component({
  selector: 'time-machine',
  templateUrl: './time-machine.component.html',
  styleUrls: ['./time-machine.component.css']
})
export class TimeMachineComponent implements OnInit {

  @Input() width = '480px';

  @Input() height = '320px';

  @Input() perspective = '1000px';

  @Input() transition = 'all 1s';

  @Input() translateX = -500;
  
  @Input() translateY = -300;

  @Input() translateZ = -1000;

  @Input() rotateX = -90;

  @Input() maxTranslateZ = -3000;

  @Input() data = new Array<any>();

  @Input() trackByFn: Function;

  @Input() contentClass: string;

  @Output() initContent = new EventEmitter<TimeMachineInitContentEvent>();
  
  @Output() transformContent = new EventEmitter<TimeMachineTransformContentEvent>();

  @Output() contentActive = new EventEmitter<TimeMachineContentActiveEvent>();

  @Output() contentVisible = new EventEmitter<TimeMachineContentVisibleEvent>();

  @ContentChild(TimeMachineContentDirective, {read: TemplateRef}) contentTemplate;

  content = new Array<TimeMachineContent>();

  activeIndex: number;

  constructor() { }

  ngOnInit() {
    if (this.data) {
      this.content = new Array<TimeMachineContent>();
      for (let i=0; i<this.data.length; i++) {

        let content = {
          index: i,
          translateX: 0,
          translateY: 0,
          translateZ: 0,
          rotateX: 0,
          active: false,
          prevActive: false,
          visible: false,
          prevVisible: false,
          data: this.data[i]
        };

        if (this.initContent.observers.length > 0) {
          let event = new TimeMachineInitContentEvent();
          event.content = content;
          event.index = i;
          this.initContent.emit(event);
        } else {
          this.defaultInitContent(content, i)
        }

        this.content.push(content);
        this.checkForEvents(content, i);
      }
    }
  }

  @HostListener('mousewheel', ['$event']) onMouseWheelChrome(event: any) {
    this.onMouseWheel(event);
  }

  @HostListener('DOMMouseScroll', ['$event']) onMouseWheelFirefox(event: any) {
    this.onMouseWheel(event);
  }

  @HostListener('onmousewheel', ['$event']) onMouseWheelIE(event: any) {
    this.onMouseWheel(event);
  }

  onMouseWheel(event: any) {
    var event = window.event || event; // old IE support
    var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

    if ((this.activeIndex === 0 && delta === 1) || (this.activeIndex === this.content.length - 1 && delta === -1)) {
      return;
    }

    for (let i=0; i<this.content.length; i++) {
      let content = this.content[i];
      if (this.transformContent.observers.length > 0) {
        let event = new TimeMachineTransformContentEvent();
        event.content = content;
        event.delta = delta;
        event.index = i;
        this.transformContent.emit(event);
      } else {
        this.defaultTransformContent(content, delta);
      }

      this.checkForEvents(content, i);
    }
        
    // for IE
    event.returnValue = false;
    // for Chrome and Firefox
    if(event.preventDefault) {
        event.preventDefault();
    }
  }

  defaultInitContent(content: TimeMachineContent, index: number) {
    content.translateX = index * this.translateX;
    content.translateY = index * this.translateY;
    content.translateZ = index * this.translateZ;
    content.rotateX = 0;
  }

  defaultTransformContent(content: any, delta: number) {
    content.translateX += delta * this.translateX;
    content.translateY += delta * this.translateY;
    content.translateZ += delta * this.translateZ;
    content.rotateX = content.translateZ > 0 ? this.rotateX : 0;
  }

  checkForEvents(content: TimeMachineContent, index: number) {
    content.active = content.translateZ === 0;
    content.visible = content.translateZ <= 0 && content.translateZ >= this.maxTranslateZ;  
    
    if (content.active != content.prevActive) {
      let event = new TimeMachineContentActiveEvent();
      event.content = content;
      event.index = index;
      this.contentActive.emit(event);
    }

    // Check and set after emitting event to prevent recursion.
    if (content.active) {
      this.activeIndex = index;
    }

    content.prevActive = content.active;

    if (content.visible != content.prevVisible) {
      let event = new TimeMachineContentVisibleEvent();
      event.content = content;
      event.index = index;
      this.contentVisible.emit(event);
    }

    content.prevVisible = content.visible;
  }

  contentClick(index: number) {
    this.setActive(index);
  }

  public setActive(index: number) {
    let delta = index - this.activeIndex;
    for (let i=0; i<this.content.length; i++) {
      let content = this.content[i];
      if (this.transformContent.observers.length > 0) {
        let event = new TimeMachineTransformContentEvent();
        event.content = content;
        event.index = i;
        event.delta = -delta;
        this.transformContent.emit(event);
      } else {
        this.defaultTransformContent(content, -delta);
      }
      
      this.checkForEvents(content, i);
    }
  }

}
