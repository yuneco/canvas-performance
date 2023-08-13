export const detectFps = async () => {
  return new Promise<number>((resolve) => {
    let count = 0;
    const startTime = Date.now();
    const tick = () => {
      count++;
      if (Date.now() - startTime < 1000) {
        requestAnimationFrame(tick);
      } else {
        if (count > 50 && count < 70) {
          resolve(60);
        } else {
          resolve(count);
        }
      }
    };
    requestAnimationFrame(tick);
  });
};
