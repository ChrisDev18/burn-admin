import {z} from "zod";

export const createFormReducer = <T>(schema: z.ZodSchema<T>, initialValues: T) => {

  type FormState = {
    values: T;
    errors: Partial<Record<keyof T, string[]>>;
    message: string | null;
  };

  const initialState: FormState = {
    values: initialValues,
    errors: {},
    message: null
  };

  type Action =
      | { type: 'CHANGE'; field: keyof T; value: string }
      | { type: 'VALIDATE' }
      | { type: 'SET_ERRORS'; errors: Partial<Record<keyof T, string[]>> }
      | { type: 'SET_MESSAGE'; message: string | null }
      | { type: 'RESET' };

  const reducer = (state: FormState, action: Action): FormState => {
    switch (action.type) {
      case 'CHANGE': {
        const newValues = { ...state.values, [action.field]: action.value };
        // const result = LoginSchema.safeParse(newValues);
        // const errors = result.success ? {} : result.error.flatten().fieldErrors;
        return { ...state, values: newValues };
      }
      case 'VALIDATE': {
        const result = schema.safeParse(state.values);
        const errors = result.success ? {} : result.error.flatten().fieldErrors;
        return { ...state, errors };
      }
      case 'SET_ERRORS':
        return { ...state, errors: action.errors };
      case 'SET_MESSAGE':
        return { ...state, message: action.message };
      case 'RESET':
        return initialState;
      default:
        return state;
    }
  }

  return {reducer, initialState};
}