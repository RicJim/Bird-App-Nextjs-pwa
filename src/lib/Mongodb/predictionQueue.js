import { savePrediction } from "./savePrediction";

class PredictionQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.maxRetries = 3;
    this.retryDelays = [1000, 5000, 10000]; // milisegundos
  }

  async enqueue(prediction) {
    const taskId = `task_${Date.now()}_${Math.random()}`;

    const task = {
      id: taskId,
      prediction,
      retries: 0,
      createdAt: Date.now(),
      status: "pending",
    };

    this.queue.push(task);
    console.log(`Predicción encolada (Cola: ${this.queue.length})`);

    this.processQueue().catch((err) => {
      console.error("Error procesando cola:", err);
    });

    return taskId;
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const task = this.queue[0];

      try {
        task.status = "processing";
        console.log(`Procesando predicción: ${task.id}`);

        await savePrediction(task.prediction);

        task.status = "completed";
        this.queue.shift();
        console.log(`Predicción guardada: ${task.id}`);
      } catch (error) {
        console.error(`Error en predicción ${task.id}:`, error);

        if (task.retries < this.maxRetries) {
          task.retries++;
          const delay = this.retryDelays[task.retries - 1] || 10000;

          console.warn(
            `Reintentando en ${delay}ms (intento ${task.retries}/${this.maxRetries})`
          );

          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          task.status = "failed";
          this.queue.shift();
          console.error(
            `Predicción fallida después de ${this.maxRetries} reintentos`
          );
        }
      }
    }

    this.isProcessing = false;
    console.log("Cola procesada");
  }

  getTaskStatus(taskId) {
    const task = this.queue.find((t) => t.id === taskId);
    return task ? task.status : "not_found";
  }

  getQueueSize() {
    return this.queue.length;
  }

  getStats() {
    const pending = this.queue.filter((t) => t.status === "pending").length;
    const processing = this.queue.filter(
      (t) => t.status === "processing"
    ).length;
    const completed = this.queue.filter((t) => t.status === "completed").length;
    const failed = this.queue.filter((t) => t.status === "failed").length;

    return {
      total: this.queue.length,
      pending,
      processing,
      completed,
      failed,
      isProcessing: this.isProcessing,
    };
  }

  cleanup() {
    const initialSize = this.queue.length;
    this.queue = this.queue.filter(
      (t) => t.status !== "completed" && t.status !== "failed"
    );
    const removed = initialSize - this.queue.length;
    console.log(`🧹 Limpieza: ${removed} tareas removidas`);
  }

  clear() {
    const size = this.queue.length;
    this.queue = [];
    console.log(`Cola limpiada: ${size} tareas removidas`);
  }
}

export const predictionQueue = new PredictionQueue();

export { PredictionQueue };
