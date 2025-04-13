"use client";

import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

function ToastClient({ message, options }) {
  useEffect(
    function () {
      toast(message, options);
    },
    [message, options]
  );
  return (
    <div>
      <Toaster />
    </div>
  );
}

export default ToastClient;
