// 唯一标识符生成函数
export function makeUid(fileName: string) {
    return (typeof crypto !== 'undefined' && (crypto as any).randomUUID)
        ? (crypto as any).randomUUID()
        : `${fileName}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}