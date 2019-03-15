
export interface ConnectionSpeedIface {
  size: number;
  speed: number;
  time: number;
  related: number;
  isSlow: boolean;
}

export const CONNECTION_SPEED_DEF: ConnectionSpeedIface = {
  size: 0,
  speed: 0,
  time: 0,
  related: 0,
  isSlow: false,
};

export function getConnectionSpeed(): Promise<ConnectionSpeedIface> {
  return new Promise<ConnectionSpeedIface>((res, rej) => {
    const init = Date.now();
    fetch('/assets/images/speed-test.png').then(
      response => (!response.ok ? null : response.blob()),
    ).then(
      b => {
        const end = Date.now();
        const size = b.size;
        const time = end - init;
        const speed = b.size / time;
        const related = time / 16000;
        // below 60fps
        const isSlow = related > 1;
        res({ size, time, speed, related, isSlow });
      },
    ).catch(
      err => rej(err),
    );
  });
}
