let toastHandler = null

export function registerToast(fn) {
    toastHandler = fn 
}

export function showToast(message) {
    toastHandler?.(message)
}