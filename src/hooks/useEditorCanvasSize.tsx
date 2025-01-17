import { useEffect } from "react"
import { useEditorStore } from "./useEditorStore";

export const useEditorCanvasSize = () => {
  const { setCanvasWidth, setCanvasHeight } = useEditorStore();

  useEffect(() => {
    setCanvasWidth(window.innerWidth);
    setCanvasHeight(window.innerHeight);

    window.addEventListener("resize", () => {
      setCanvasHeight(window.innerHeight);
      setCanvasWidth(window.innerWidth);
    })
  }, [])

}
