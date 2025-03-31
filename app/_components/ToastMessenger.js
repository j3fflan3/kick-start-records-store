"use client";

import { Toaster } from "react-hot-toast";

function ToastMessenger({ children }) {
  return <Toaster>{children}</Toaster>;
}

export default ToastMessenger;
