// "iPhone 15 Pro Max 256GB Đen" → "iphone-15-pro-max-256gb-den"
export const toSlug = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
