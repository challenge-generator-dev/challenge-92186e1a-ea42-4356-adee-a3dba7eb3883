import { useState, useCallback, useEffect } from 'react';
import { FieldValues, SubmitHandler, FieldError } from 'react-hook-form';
import { z, ZodSchema } from 'zod';

export interface UseFormOptions<T extends FieldValues> {
  defaultValues: Partial<T>;
  schema?: ZodSchema<T>;
  onSubmit: SubmitHandler<T>;
}

export interface UseFormReturnType<T extends FieldValues> {
  register: (name: keyof T, options?: RegisterOptions) => {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    ref: (instance: HTMLInputElement | null) => void;
    name: string;
    value?: string;
  };
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  reset: (values?: Partial<T>) => void;
  setValue: (name: keyof T, value: unknown) => void;
  getValues: () => T;
  watch: (name?: keyof T) => unknown;
  errors: Partial<Record<keyof T, FieldError>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

interface RegisterOptions {
  required?: string | boolean;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: Record<string, string | ((value: unknown) => string | boolean)>;
}

export function useForm<T extends FieldValues>(
  options: UseFormOptions<T>
): UseFormReturnType<T> {
  const { defaultValues, schema, onSubmit } = options;

  const [values, setValues] = useState<Partial<T>>(defaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, FieldError>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const validateField = useCallback(
    (name: keyof T, value: unknown): string | null => {
      if (!schema) return null;

      const fieldSchema = (schema as z.ZodObject<Record<string, z.ZodTypeAny>>).shape[name];
      if (!fieldSchema) return null;

      try {
        fieldSchema.parse(value);
        return null;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors.find((e) => e.path[0] === name);
          return fieldError ? fieldError.message : null;
        }
        return null;
      }
    },
    [schema]
  );

  const validateAll = useCallback((): boolean => {
    if (!schema) return true;

    try {
      schema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof T, FieldError>> = {};
        error.errors.forEach((err) => {
          const fieldName = err.path[0] as keyof T;
          newErrors[fieldName] = {
            type: err.code,
            message: err.message,
            ref: { name: fieldName as string } as HTMLInputElement,
          };
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [schema, values]);

  const register = useCallback(
    (name: keyof T, _options?: RegisterOptions) => {
      return {
        name: name as string,
        value: values[name] as string | undefined,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = event.target.value;
          setValues((prev) => ({ ...prev, [name]: newValue }));
          setIsDirty(true);

          const errorMessage = validateField(name, newValue);
          setErrors((prev) => {
            const newErrors = { ...prev };
            if (errorMessage) {
              newErrors[name] = {
                type: 'validation',
                message: errorMessage,
                ref: { name: name as string } as HTMLInputElement,
              };
            } else {
              delete newErrors[name];
            }
            return newErrors;
          });
        },
        onBlur: () => {
          const value = values[name];
          const errorMessage = validateField(name, value);
          setErrors((prev) => {
            const newErrors = { ...prev };
            if (errorMessage) {
              newErrors[name] = {
                type: 'validation',
                message: errorMessage,
                ref: { name: name as string } as HTMLInputElement,
              };
            }
            return newErrors;
          });
        },
        ref: (instance: HTMLInputElement | null) => {
          if (instance) {
            instance.value = (values[name] as string) || '';
          }
        },
      };
    },
    [values, validateField]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      setIsSubmitting(true);

      const keys = Object.keys(values) as unknown as (keyof T)[];
      const isValid = validateAll();

      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      try {
        await onSubmit(values as T);
        setIsDirty(false);
      } catch (error) {
        console.error('Error en el envío del formulario:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit, validateAll]
  );

  const reset = useCallback(
    (newValues?: Partial<T>) => {
      setValues(newValues || defaultValues);
      setErrors({});
      setIsDirty(false);
    },
    [defaultValues]
  );

  const setValue = useCallback((name: keyof T, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  }, []);

  const getValues = useCallback((): T => {
    return values as T;
  }, [values]);

  const watch = useCallback(
    (name?: keyof T): unknown => {
      if (name) {
        return values[name];
      }
      return values;
    },
    [values]
  );

  useEffect(() => {
    if (schema) {
      validateAll();
    }
  }, []);

  const isValid = Object.keys(errors).length === 0;

  return {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    errors,
    isSubmitting,
    isValid,
    isDirty,
  };
}

export default useForm;