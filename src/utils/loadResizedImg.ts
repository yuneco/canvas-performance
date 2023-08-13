import imgPath from "../assets/img.png";

export const loadResizedImg = (size: number): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imgPath;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("no canvas context");
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      const newImg = new Image();
      newImg.src = canvas.toDataURL();
      newImg.onload = () => resolve(newImg);
    };
  });
