'use client'

import {useReducer, useState} from 'react'
import {Button, Flex, Heading, IconButton, Text, TextField} from "@radix-ui/themes";
import {EyeClosedIcon, EyeOpenIcon} from "@radix-ui/react-icons";
import Form from "next/form";
import {LoginResponse, LoginSchema} from "@/app/lib/types/auth";
import {z} from "zod";

type LoginFormValues = z.infer<typeof LoginSchema>;
type LoginFormErrors = Partial<Record<keyof LoginFormValues, string[]>>;


type FormState = {
  values: LoginFormValues;
  errors: LoginFormErrors;
};

type Action =
    | { type: 'CHANGE'; field: keyof LoginFormValues; value: string }
    | { type: 'VALIDATE' }
    | { type: 'SET_ERRORS'; errors: LoginFormErrors }
    | { type: 'RESET' };

const initialState: FormState = {
  values: { email: '', password: '' },
  errors: {},
};

function formReducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case 'CHANGE': {
      const newValues = { ...state.values, [action.field]: action.value };
      // const result = LoginSchema.safeParse(newValues);
      // const errors = result.success ? {} : result.error.flatten().fieldErrors;
      return { ...state, values: newValues };
    }
    case 'VALIDATE': {
      const result = LoginSchema.safeParse(state.values);
      const errors = result.success ? {} : result.error.flatten().fieldErrors;
      return { ...state, errors };
    }
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export default function LoginForm() {
  const [pending, setPending] = useState(false)
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [visible, setVisible] = useState(false);

  const handleSubmit = async () => {
    setPending(true);
    dispatch({ type: 'VALIDATE' });

    const result = LoginSchema.safeParse(state.values);
    if (!result.success) {
      dispatch({ type: 'SET_ERRORS', errors: result.error.flatten().fieldErrors });
      setPending(false);
      return;
    }

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(state.values)
      });

      const data: LoginResponse = await res.json();

      if (!res.ok || !data.success) {
        if ("errors" in data) {
          dispatch({ type: 'SET_ERRORS', errors: data.errors });
        } else {
          console.log("Login error:", data.message);
        }
      } else {
        console.log("Login successful:", data.message);
      }
    } catch (err) {
      console.error("Network error:", err);
    }

    setPending(false);
  };

  return (
      <Flex direction="column" gap="4" width="100%" maxWidth="360px" asChild>
        <Form action={handleSubmit}>
          <Heading align="center">Log in</Heading>

          {/* Email Field */}
          <Flex direction="column">
            <Text as="label" htmlFor="email" mb="1">
              Email
            </Text>
            <TextField.Root
                id="email"
                name="email"
                placeholder="e.g. abc123@student.bham.ac.uk"
                value={state.values.email}
                onChange={(e) =>
                    dispatch({ type: 'CHANGE', field: 'email', value: e.target.value })
                }
            />
            {state.errors.email && (
                <Text size="2" mt="2" color="red">
                  {state.errors.email.join(', ')}
                </Text>
            )}
          </Flex>

          {/* Password Field */}
          <Flex direction="column">
            <Text as="label" htmlFor="password" mb="1">
              Password
            </Text>
            <TextField.Root
                id="password"
                name="password"
                placeholder="Enter password"
                type={visible ? 'text' : 'password'}
                value={state.values.password}
                onChange={(e) =>
                    dispatch({ type: 'CHANGE', field: 'password', value: e.target.value })
                }
            >
              <TextField.Slot side="right">
                <IconButton
                    size="1"
                    variant="ghost"
                    type="button"
                    onClick={() => setVisible(!visible)}
                >
                  {visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </IconButton>
              </TextField.Slot>
            </TextField.Root>

            {state.errors.password && (
                <Text size="2" mt="2" color="red">
                  {state.errors.password.join(', ')}
                </Text>
            )}
          </Flex>

          <Button loading={pending} type="submit" mt="4">
            Log in
          </Button>
        </Form>
      </Flex>
  )
}