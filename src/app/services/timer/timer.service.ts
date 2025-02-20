import { Injectable, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timer: any;

  startTimer(timeLeft: WritableSignal<number>, onTimeUp: () => void) {
    this.timer = setInterval(() => {
      const newTime = timeLeft() - 1;
      timeLeft.set(newTime);
      if (newTime <= 0) {
        this.stopTimer();
        onTimeUp();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}