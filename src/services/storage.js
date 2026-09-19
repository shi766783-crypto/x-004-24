// 底层持久化：对 localStorage 的最小封装。
// 统一做 try/catch 与 JSON 序列化，其余层不直接触碰 localStorage。

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch (e) {
    console.error(`[storage] 读取失败: ${key}`, e)
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error(`[storage] 写入失败: ${key}`, e)
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(key)
  } catch (e) {
    console.error(`[storage] 删除失败: ${key}`, e)
  }
}
