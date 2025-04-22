
import { toast, Id } from 'react-toastify';

import { calculateProgress } from "@/utils/progress";

export const notifyToastCustomProgress = (
    content: string,
    duration_millis: number,
    toastId: React.RefObject<Id | undefined>,
    termination_criteria: () => boolean,
) => {
    if (toastId?.current) {
      toast.dismiss(toastId.current);
    };

    const startTime = Date.now();
    const interval = 50; // Update every 50ms

    const currToastId = toast.loading(content, {
      autoClose: duration_millis,
      closeButton: true,
    });
    toastId.current = currToastId;

    const toastTimer = setInterval(() => {
      const elapsed_millis = Date.now() - startTime;

      const progress = Math.min(calculateProgress(elapsed_millis, duration_millis), 0.98); // Never reach end
      toast.update(currToastId, {
        progress: progress,
        render: `${content} (${(progress * 100).toFixed(0)}%)`,
      });
      
      if (elapsed_millis >= duration_millis || termination_criteria() ) {
        clearInterval(toastTimer);
        toast.dismiss(currToastId);
      }
    }, interval);
  }