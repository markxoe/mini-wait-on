// This is an util to get a promise that resolves when the intervaltimer is done
// The payload gets an done function, which basically stops the interval and resolves the promise
export const timerPromise = (
  fn: (done: () => void) => void,
  interval: number
) => {
  return new Promise<void>((resolve) => {
    const id = setInterval(() => {
      fn(() => {
        clearInterval(id);
        resolve();
      });
    }, interval);
  });
};
