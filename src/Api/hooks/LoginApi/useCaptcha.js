import { useState, useRef, useEffect } from "react";

export const useCaptcha = () => {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const canvasRef = useRef(null);

  const randomChar = (min, max) =>
    String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min));

  const createCaptchaString = () => {
    let text = "";
    for (let i = 0; i < 2; i++) {
      text += randomChar(65, 90);
      text += randomChar(97, 122);
      text += randomChar(48, 57);
    }
    return text.split("").sort(() => Math.random() - 0.5).join("");
  };

  const drawCaptcha = (ctx, captcha) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const colors = ["black", "gray"];
    const letterSpace = 150 / captcha.length;
    const xOffset = 25;

    captcha.split("").forEach((char, index) => {
      ctx.font = "20px Roboto Mono";
      ctx.fillStyle = colors[Math.floor(Math.random() * 2)];
      ctx.fillText(char, xOffset + index * letterSpace, Math.random() * 16 + 25);
    });
  };

  const refreshCaptcha = () => {
    setUserInput("");
    const text = createCaptchaString();
    setCaptchaText(text);
    drawCaptcha(canvasRef.current.getContext("2d"), text);
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    refreshCaptcha(ctx);
  }, []);

  return {
    captchaText,
    userInput,
    setUserInput,
    canvasRef,
    refreshCaptcha,
  };
};
