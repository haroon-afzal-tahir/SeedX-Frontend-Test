import { RefObject, useEffect } from "react";

type CallbackFunction = () => void;

export const useOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  callback: CallbackFunction
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref && ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};
