export function useFileText(onLoad) {
  return async (file) => {
    if (!file) return
    const text = await file.text()
    onLoad(text)
  }
}
