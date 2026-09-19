"use client";

import { useEffect, useState } from "react";

// Minimal hand-rolled replacement for the CRA app's `typewriter-effect`
// package (not installed in this Next.js project — this app's established
// convention is manual implementations over adding new form/animation
// dependencies where a small one suffices, see BlogInquiryForm/EnrollmentForm
// avoiding formik/yup). Same visible behavior as the CRA usage: cycles
// through `strings`, typing at `delay`ms/char, pausing `pauseFor`ms, then
// deleting at `deleteSpeed`ms/char before moving to the next string.
export default function Typewriter({ strings, delay = 100, deleteSpeed = 20, pauseFor = 3000, loop = true }) {
  const [text, setText] = useState("");
  const [stringIndex, setStringIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = strings[stringIndex % strings.length];
    let timeout;

    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), delay);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), pauseFor);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), deleteSpeed);
    } else if (deleting && text.length === 0) {
      timeout = setTimeout(() => {
        setDeleting(false);
        setStringIndex((i) => (loop ? (i + 1) % strings.length : Math.min(i + 1, strings.length - 1)));
      }, 0);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, stringIndex, strings, delay, deleteSpeed, pauseFor, loop]);

  return (
    <span>
      {text}
      <span className="typewriter-cursor">|</span>
    </span>
  );
}
