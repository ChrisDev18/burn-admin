'use client';

import { useReducer, useState } from 'react';
import {
  Button,
  Callout,
  Flex,
  Heading,
  IconButton,
  Text,
  TextField,
} from '@radix-ui/themes';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import Form from 'next/form';
import { createFormReducer } from '@/app/lib/logic/FormReducerFactory';
import { LoginSchema } from '@/app/lib/types/auth';
import { useRouter } from 'next/navigation';
import {loginAction} from "@/app/api/auth/login/loginAction";

const { reducer, initialState } = createFormReducer(LoginSchema, {
  email: '',
  password: '',
});

export default function LoginForm() {
  const [pending, setPending] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [visible, setVisible] = useState(false);

  const handleSubmit = async () => {
    setPending(true);

    dispatch({ type: 'SET_ERRORS', errors: {} });

    const result = await loginAction(state.values);

    if (result.success) {
      dispatch({ type: 'SET_MESSAGE', message: result.message });
    } else {
      if ('errors' in result) {
        dispatch({ type: 'SET_ERRORS', errors: result.errors });
      } else {
        dispatch({ type: 'SET_MESSAGE', message: result.message });
      }
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
                    dispatch({
                      type: 'CHANGE',
                      field: 'email',
                      value: e.target.value,
                    })
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
                    dispatch({
                      type: 'CHANGE',
                      field: 'password',
                      value: e.target.value,
                    })
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

          {state.message && (
              <Callout.Root color="blue">
                <Callout.Text>{state.message}</Callout.Text>
              </Callout.Root>
          )}

          <Button loading={pending} type="submit" mt="4">
            Log in
          </Button>
        </Form>
      </Flex>
  );
}