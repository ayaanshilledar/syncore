import { toast } from "gooey-toast";
import { play } from "cuelume";

export const showToast = {
  success: (title: string, description?: string) => {
    play("success");
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
    play("error");
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
    play("ready");
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
