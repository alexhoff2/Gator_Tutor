import { toast, type ToastT } from "sonner";

interface ToastOptions {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const DEFAULT_DURATION = 4000;

export const notify = {
  success: (message: string, options?: ToastOptions) => {
    toast(message, {
      className: "bg-green-50/80 backdrop-blur-md border-green-200",
      descriptionClassName: "text-green-700",
      duration: DEFAULT_DURATION,
      position: "top-center",
      dismissible: true,
      style: {
        backgroundColor: "rgba(240, 253, 244, 0.8)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgb(187, 247, 208)",
        color: "rgb(21, 128, 61)",
        fontWeight: "500",
      },
      ...options,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      className: "bg-red-50/80 backdrop-blur-md border-red-200",
      descriptionClassName: "text-red-700",
      duration: 5000,
      position: "top-center",
      dismissible: true,
      style: {
        backgroundColor: "rgba(254, 242, 242, 0.8)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgb(254, 202, 202)",
        color: "rgb(185, 28, 28)",
        fontWeight: "500",
      },
      ...options,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      className: "bg-[#4B2E83]/5 backdrop-blur-md border-[#4B2E83]/20",
      descriptionClassName: "text-[#4B2E83]",
      duration: DEFAULT_DURATION,
      position: "top-center",
      dismissible: true,
      style: {
        backgroundColor: "rgba(75, 46, 131, 0.05)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(75, 46, 131, 0.2)",
        color: "#4B2E83",
        fontWeight: "500",
      },
      ...options,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast(message, {
      className: "bg-yellow-50/80 backdrop-blur-md border-yellow-200",
      descriptionClassName: "text-yellow-800",
      duration: DEFAULT_DURATION,
      position: "top-center",
      dismissible: true,
      style: {
        backgroundColor: "rgba(254, 252, 232, 0.8)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgb(254, 240, 138)",
        color: "rgb(133, 77, 14)",
        fontWeight: "500",
      },
      ...options,
    });
  },
};
