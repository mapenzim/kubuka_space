export type ScheduledTask = {
  id: string;

  timer: NodeJS.Timeout;

  runAt: Date;

  callback: () => void | Promise<void>;
};

export class Scheduler {
  private readonly tasks =
    new Map<
      string,
      ScheduledTask
    >();

  // =====================================================
  // SCHEDULE
  // =====================================================

  schedule(
    id: string,
    delay: number,
    callback: () => void | Promise<void>
  ) {
    this.cancel(id);

    const timer =
      setTimeout(async () => {
        try {
          await callback();
        } finally {
          this.tasks.delete(id);
        }
      }, delay);

    this.tasks.set(id, {
      id,

      timer,

      runAt: new Date(
        Date.now() + delay
      ),

      callback,
    });
  }

  // =====================================================
  // CANCEL
  // =====================================================

  cancel(
    id: string
  ) {
    const task =
      this.tasks.get(id);

    if (!task) {
      return;
    }

    clearTimeout(
      task.timer
    );

    this.tasks.delete(id);
  }

  // =====================================================
  // RESCHEDULE
  // =====================================================

  reschedule(
    id: string,
    delay: number,
    callback: () => void | Promise<void>
  ) {
    this.schedule(
      id,
      delay,
      callback
    );
  }

  // =====================================================
  // STATUS
  // =====================================================

  exists(
    id: string
  ) {
    return this.tasks.has(id);
  }

  get(
    id: string
  ) {
    return this.tasks.get(id);
  }

  getAll() {
    return [
      ...this.tasks.values(),
    ];
  }

  count() {
    return this.tasks.size;
  }

  // =====================================================
  // CLEAR
  // =====================================================

  clear() {
    for (const task of this.tasks.values()) {
      clearTimeout(
        task.timer
      );
    }

    this.tasks.clear();
  }
}

export const scheduler =
  new Scheduler();