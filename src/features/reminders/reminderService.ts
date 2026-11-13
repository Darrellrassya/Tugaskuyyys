import { Task } from '../../types';
import { playChimeSound } from '../../lib/audio';

type ReminderCallback = (task: Task) => void;

class ReminderService {
  private listeners: Set<ReminderCallback> = new Set();
  private timer: number | null = null;
  private triggeredTasks: Set<string> = new Set();

  public subscribe(cb: ReminderCallback): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    if (Notification.permission === 'granted') {
      return 'granted';
    }
    try {
      return await Notification.requestPermission();
    } catch {
      return 'denied';
    }
  }

  public getPermissionStatus(): NotificationPermission {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  public startChecking(getTasks: () => Task[], onTaskTriggered: (task: Task) => void) {
    if (this.timer) {
      window.clearInterval(this.timer);
    }

    const check = () => {
      const now = new Date().getTime();
      const tasks = getTasks();

      tasks.forEach((task) => {
        if (task.status === 'selesai' || !task.reminder) return;
        if (task.reminder.isTriggered && !task.reminder.isSnoozed) return;

        // Target time is either snoozedUntil or remindAt
        const targetIso = task.reminder.isSnoozed && task.reminder.snoozedUntil
          ? task.reminder.snoozedUntil
          : task.reminder.remindAt;

        if (!targetIso) return;
        const targetTime = new Date(targetIso).getTime();

        // If targetTime has arrived or passed (within a reasonable window)
        if (now >= targetTime && !this.triggeredTasks.has(`${task.id}-${targetIso}`)) {
          this.triggeredTasks.add(`${task.id}-${targetIso}`);
          this.notify(task);
          onTaskTriggered(task);
        }
      });
    };

    // Check immediately and then every 10 seconds
    check();
    this.timer = window.setInterval(check, 10000);
  }

  public stopChecking() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  private notify(task: Task) {
    // 1. Play gentle chime
    playChimeSound();

    // 2. Dispatch to app listeners (for in-app ReminderPaper banner)
    this.listeners.forEach((cb) => {
      try {
        cb(task);
      } catch (err) {
        console.error(err);
      }
    });

    // 3. Native browser notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification(`Pengingat Tugas: ${task.title}`, {
          body: task.description || 'Waktunya menyelesaikan tugas ini.',
          icon: '/favicon.ico',
          tag: task.id,
        });

        notif.onclick = () => {
          window.focus();
          window.location.hash = `#/tugas/${task.id}`;
        };
      } catch (err) {
        console.warn('Browser notification failed:', err);
      }
    }
  }
}

export const reminderService = new ReminderService();
