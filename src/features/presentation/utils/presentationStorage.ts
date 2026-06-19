export function getLectureIdFromPath(): string {
  if (typeof window === 'undefined') return 'mock';
  const pathParts = window.location.pathname.split('/');
  return pathParts[3] || 'mock';
}

export function isProjectionView(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.search.includes('projection=true');
}

export const storageKeys = {
  activeSlide: (lectureId: string) => `cee_active_slide_${lectureId}`,
  clickStep: (lectureId: string, slideNo: number) => `cee_click_${lectureId}_s${slideNo}`,
  syncedParam: (lectureId: string, slideNo: number | undefined, paramKey: string) =>
    slideNo ? `cee_param_${lectureId}_s${slideNo}_${paramKey}` : `cee_param_${paramKey}`,
};

export function getStorageItem<T>(key: string, fallback: T, parser?: (val: string) => T): T {
  if (typeof window === 'undefined') return fallback;
  const saved = localStorage.getItem(key);
  if (saved === null) return fallback;
  if (parser) return parser(saved);
  
  if (typeof fallback === 'number') {
    const num = parseFloat(saved);
    return (isNaN(num) ? fallback : num) as unknown as T;
  }
  if (typeof fallback === 'boolean') {
    return (saved === 'true') as unknown as T;
  }
  if (typeof fallback === 'object' && fallback !== null) {
    try {
      return JSON.parse(saved) as T;
    } catch {
      return fallback;
    }
  }
  return saved as unknown as T;
}

export function setStorageItem(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  const strValue = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);
  localStorage.setItem(key, strValue);
}

export function clearLectureStorage(lectureId: string): void {
  if (typeof window === 'undefined') return;
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('cee_') && key.includes(`_${lectureId}`) && !key.startsWith('cee_drawings_')) {
      localStorage.removeItem(key);
    }
  });
}
