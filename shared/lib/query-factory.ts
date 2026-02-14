// To jest generyczna fabryka. Piszesz ją RAZ.
export function createQueryKeys(featureName: string) {
  return {
    all: [featureName] as const,
    lists: () => [featureName, 'list'] as const,
    list: (filters: Record<string, any> = {}) => [featureName, 'list', { ...filters }] as const,
    details: () => [featureName, 'detail'] as const,
    detail: (id: string | number) => [featureName, 'detail', id] as const,
  };
}