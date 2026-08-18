function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

function formatAbsoluteDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const date = new Date(iso)
  const diffSec = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000))
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'только что'
  if (diffMin < 60) return `${diffMin} ${pluralize(diffMin, 'минуту', 'минуты', 'минут')} назад`
  if (diffHour < 24) return `${diffHour} ${pluralize(diffHour, 'час', 'часа', 'часов')} назад`
  if (diffDay === 1) return 'вчера'
  if (diffDay < 7) return `${diffDay} ${pluralize(diffDay, 'день', 'дня', 'дней')} назад`
  return formatAbsoluteDate(date)
}
