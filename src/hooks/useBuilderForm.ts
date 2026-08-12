import { useCallback, useState } from 'react';
import { emptyBuilder, type Builder } from '@/types/builder';

export function useBuilderForm() {
  const [builder, setBuilder] = useState<Builder>(emptyBuilder);

  const update = useCallback(
    (field: keyof Builder, value: string) =>
      setBuilder((current) => ({ ...current, [field]: value })),
    [],
  );

  const requiredFilled = Boolean(
    builder.name.trim() && builder.role.trim() && builder.stack.trim(),
  );

  const reset = useCallback(() => setBuilder(emptyBuilder), []);

  return { builder, update, requiredFilled, reset };
}
