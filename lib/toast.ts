import { toast } from "gooey-toast";

export const showToast = {
  success: (title: string, description?: string) => {
    toast.success({
      title,
      description,
      position: "bottom-right",
      fill: "#171717",
      roundness: 14,
      duration: 2500,
    });
  },
  error: (title: string, description?: string) => {
    toast.error({
      title,
      description,
      position: "bottom-right",
      fill: "#171717",
      roundness: 14,
      duration: 3500,
    });
  },
  info: (title: string, description?: string) => {
    toast.info({
      title,
      description,
      position: "bottom-right",
      fill: "#171717",
      roundness: 14,
      duration: 2500,
    });
  },
};
