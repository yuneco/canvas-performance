import { drawImgs } from "./commands/drawImgs";
import { fillCircle } from "./commands/drawOval";
import {
  drawPreConstructedPath,
  drawPreConstructedPath2,
} from "./commands/drawPath";
import { fillRects } from "./commands/drawRects";
import { drawText } from "./commands/drawText";
import "./style.css";
import { detectFps } from "./utils/detectFps";
import { loadResizedImg } from "./utils/loadResizedImg";
import { wait } from "./utils/wait";

const initCanvas = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width / 2}px`;
  canvas.style.height = `${height / 2}px`;
  document.body.appendChild(canvas);
  return canvas;
};

const setStatus = (text: string) => {
  const stats = document.getElementById("status-text")!;
  stats.textContent = `${text}`;
}

const openLastDetail = () => {
  const details = document.querySelectorAll("details");
  details.forEach((d) => (d.open = false));
  const lastDetail = details[details.length - 1];
  lastDetail.open = true;
};

type TestFunc = (count: number) => void;
const execTest = async (
  test: TestFunc,
  count: number,
  timeoutMs: number
): Promise<number> => {
  let timesLeft = 60;
  const startTime = performance.now();

  const promise = new Promise<number>((resolve, reject) => {
    const tick = () => {
      timesLeft--;
      test(count);
      const time = performance.now() - startTime;
      if (timesLeft > 0) {
        if (time > timeoutMs) {
          reject("timeout");
          return;
        }
        requestAnimationFrame(tick);
      } else {
        resolve(time);
      }
    };
    requestAnimationFrame(tick);
  });

  return promise;
};

type TestEntry = {
  name: string;
  func: TestFunc;
};
type TestSet = {
  title: string;
  entries: TestEntry[];
  counts: number[];
  unitLabel: string;
};

let fps = 0;
const execTestSet = async (testSet: TestSet) => {
  if (!fps) {
    fps = await detectFps();
  }

  const DROP_LIMIT = (60 / fps) * 1000 * 1.1;
  const TIMEOUT_LIMIT = DROP_LIMIT * 4;
  const TIMEOUT_MSG = "(skipped)";


  const detailsBox = document.createElement("details");
  const summaryBox = document.createElement("summary");
  summaryBox.textContent = testSet.title;
  detailsBox.appendChild(summaryBox);
  document.body.appendChild(detailsBox);
  openLastDetail();

  const row = document.createElement("div");
  row.classList.add("result-head-row");
  detailsBox.appendChild(row);
  // row title
  const cell = document.createElement("span");
  cell.textContent = testSet.unitLabel;
  row.appendChild(cell);

  for (const count of testSet.counts) {
    const cell = document.createElement("span");
    cell.textContent = `${count}ops/fr`;
    row.appendChild(cell);
  }

  for (const test of testSet.entries) {
    const row = document.createElement("div");
    row.classList.add("result-row");
    detailsBox.appendChild(row);

    const rowTitle = document.createElement("span");
    rowTitle.textContent = test.name;
    row.appendChild(rowTitle);

    let timeout = false;
    for (const count of testSet.counts) {
      const cell = document.createElement("span");
      if (timeout) {
        cell.textContent = TIMEOUT_MSG;
        cell.classList.add("dropped");
        row.appendChild(cell);
        continue;
      }

      const time = await execTest(test.func, count, TIMEOUT_LIMIT).catch(
        () => {
          console.log("timeout");
          timeout = true;
          return TIMEOUT_LIMIT + 1;
        }
      );
      row.appendChild(cell);
      cell.textContent = timeout ? TIMEOUT_MSG : `${time.toFixed(2)}ms`;
      if (time > DROP_LIMIT) {
        cell.classList.add("dropped");
      }
    }
  }
};

const runAllTests = async (ctx: CanvasRenderingContext2D) => {
  const testFillRect: TestSet = {
    title: "fillRect",
    unitLabel: "rect size(px)",
    entries: [
      { name: "1x1", func: (c) => fillRects(ctx, 1, c) },
      { name: "16x16", func: (c) => fillRects(ctx, 16, c) },
      { name: "128x128", func: (c) => fillRects(ctx, 128, c) },
      { name: "256x256", func: (c) => fillRects(ctx, 256, c) },
      { name: "512x512", func: (c) => fillRects(ctx, 512, c) },
      { name: "1024x1024", func: (c) => fillRects(ctx, 1024, c) },
    ],
    counts: [1000, 2000, 3000, 5000, 7000, 9000],
  };

  const testFillCircle: TestSet = {
    title: "fillCircle",
    unitLabel: "radius(px)",
    entries: [
      { name: "1x1", func: (c) => fillCircle(ctx, 1, c) },
      { name: "16x16", func: (c) => fillCircle(ctx, 16, c) },
      { name: "128x128", func: (c) => fillCircle(ctx, 128, c) },
      { name: "256x256", func: (c) => fillCircle(ctx, 256, c) },
      { name: "512x512", func: (c) => fillCircle(ctx, 512, c) },
      { name: "1024x1024", func: (c) => fillCircle(ctx, 1024, c) },
    ],
    counts: [1000, 2000, 3000, 5000, 7000, 9000],
  };

  const testFillPath: TestSet = {
    title: "fillPath (10 anchor points)",
    unitLabel: "dest size(px)",
    entries: [
      { name: "1x1", func: (c) => drawPreConstructedPath(ctx, 1, c) },
      { name: "16x16", func: (c) => drawPreConstructedPath(ctx, 16, c) },
      { name: "128x128", func: (c) => drawPreConstructedPath(ctx, 128, c) },
      { name: "256x256", func: (c) => drawPreConstructedPath(ctx, 256, c) },
      { name: "512x512", func: (c) => drawPreConstructedPath(ctx, 512, c) },
      { name: "1024x1024", func: (c) => drawPreConstructedPath(ctx, 1024, c) },
    ],
    counts: [1000, 2000, 3000, 5000, 7000, 9000],
  };

  const testFillPath2: TestSet = {
    title: "fillPath (120 anchor points)",
    unitLabel: "dest size(px)",
    entries: [
      { name: "1x1", func: (c) => drawPreConstructedPath2(ctx, 1, c) },
      { name: "16x16", func: (c) => drawPreConstructedPath2(ctx, 16, c) },
      { name: "128x128", func: (c) => drawPreConstructedPath2(ctx, 128, c) },
      { name: "256x256", func: (c) => drawPreConstructedPath2(ctx, 256, c) },
      { name: "512x512", func: (c) => drawPreConstructedPath2(ctx, 512, c) },
      { name: "1024x1024", func: (c) => drawPreConstructedPath2(ctx, 1024, c) },
    ],
    counts: [1000, 2000, 3000, 5000, 7000, 9000],
  };

  const TEXT_CHARS =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const testDrawText1: TestSet = {
    title: "drawText (alpabet / 62chars)",
    unitLabel: "font size(px)",
    entries: [
      { name: "1px", func: (c) => drawText(ctx, 1, TEXT_CHARS, c) },
      { name: "16px", func: (c) => drawText(ctx, 16, TEXT_CHARS, c) },
      { name: "64px", func: (c) => drawText(ctx, 64, TEXT_CHARS, c) },
      { name: "256px", func: (c) => drawText(ctx, 256, TEXT_CHARS, c) },
    ],
    counts: [500, 1000, 1500, 2000, 2500, 3000],
  };

  const TEXT_JA = "あいうえおカキクケコ日本語漢字🐱🐶🦜🐻🦈";
  const testDrawText2: TestSet = {
    title: "drawText (Japanese & emoji / 20chars)",
    unitLabel: "font size(px)",
    entries: [
      { name: "1px", func: (c) => drawText(ctx, 1, TEXT_JA, c) },
      { name: "16px", func: (c) => drawText(ctx, 16, TEXT_JA, c) },
      { name: "64px", func: (c) => drawText(ctx, 64, TEXT_JA, c) },
      { name: "256px", func: (c) => drawText(ctx, 256, TEXT_JA, c) },
    ],
    counts: [500, 1000, 1500, 2000, 2500, 3000],
  };

  const testDrawText3: TestSet = {
    title: "drawText (Japanese 'あ' / 16px)",
    unitLabel: "font size(px)",
    entries: [
      { name: "1chars", func: (c) => drawText(ctx, 16, "あ".repeat(1), c) },
      { name: "64chars", func: (c) => drawText(ctx, 16, "あ".repeat(64), c) },
      { name: "128chars", func: (c) => drawText(ctx, 16, "あ".repeat(128), c) },
      { name: "256chars", func: (c) => drawText(ctx, 16, "あ".repeat(256), c) },
      { name: "512chars", func: (c) => drawText(ctx, 16, "あ".repeat(512), c) },
    ],
    counts: [500, 1000, 1500, 2000, 2500, 3000],
  };

  const imgs = {
    "1x1": await loadResizedImg(1),
    "16x16": await loadResizedImg(16),
    "128x128": await loadResizedImg(128),
    "256x256": await loadResizedImg(256),
    "512x512": await loadResizedImg(512),
    "1024x1024": await loadResizedImg(1024),
    "4096x4096": await loadResizedImg(4096),
  };

  const testDrawImgWithSrcSize: TestSet = {
    title: "drawImg with src size",
    unitLabel: "source size(px)",
    entries: [
      { name: "1x1", func: (c) => drawImgs(ctx, imgs["1x1"], 100, c) },
      { name: "16x16", func: (c) => drawImgs(ctx, imgs["16x16"], 100, c) },
      { name: "128x128", func: (c) => drawImgs(ctx, imgs["128x128"], 100, c) },
      {
        name: "1024x1024",
        func: (c) => drawImgs(ctx, imgs["1024x1024"], 100, c),
      },
      {
        name: "4096x4096",
        func: (c) => drawImgs(ctx, imgs["4096x4096"], 100, c),
      },
    ],
    counts: [1000, 2000, 3000, 5000, 7000, 9000],
  };

  const testDrawImgWithDrawSize: TestSet = {
    title: "drawImg with draw size",
    unitLabel: "dest size(px)",
    entries: [
      { name: "1x1", func: (c) => drawImgs(ctx, imgs["1024x1024"], 1, c) },
      { name: "16x16", func: (c) => drawImgs(ctx, imgs["1024x1024"], 16, c) },
      {
        name: "128x128",
        func: (c) => drawImgs(ctx, imgs["1024x1024"], 128, c),
      },
      {
        name: "256x256",
        func: (c) => drawImgs(ctx, imgs["1024x1024"], 256, c),
      },
      {
        name: "512x512",
        func: (c) => drawImgs(ctx, imgs["1024x1024"], 512, c),
      },
      {
        name: "1024x1024",
        func: (c) => drawImgs(ctx, imgs["1024x1024"], 1024, c),
      },
    ],
    counts: [1000, 2000, 3000, 5000, 7000, 9000],
  };

  const tests = [
    testFillRect,
    testFillCircle,
    testFillPath,
    testFillPath2,
    testDrawText1,
    testDrawText2,
    testDrawText3,
    testDrawImgWithSrcSize,
    testDrawImgWithDrawSize,
  ]

  for(let index = 0; index < tests.length; index++) {
    const test = tests[index];
    const msg = `Running: ${index + 1}/${tests.length}. ${test.title}`;
    setStatus(msg);
    await execTestSet(test);
    await wait(2000);
  };

  setStatus("All test done.");

};

const main = async () => {
  const canvas = initCanvas(1920, 1080);
  const ctx = canvas.getContext("2d");

  const startButton = document.getElementById("start-button")!;
  startButton.addEventListener("click", () => {
    startButton.style.display = "none";
    runAllTests(ctx!);
  });
};

main();
