import { z } from 'zod';

export const searchSchema = z.object({
  searchText: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length === 0 || val.length >= 2, {
      message: 'El texto de búsqueda debe tener al menos 2 caracteres desestimando espacios.',
    }),
  categoryFilter: z.enum(['all', 'layer1', 'defi', 'store-of-value'], {
    errorMap: () => ({ message: 'Debe seleccionar una categoría válida admitida.' }),
  }),
});

export type SearchFormData = z.infer<typeof searchSchema>;
