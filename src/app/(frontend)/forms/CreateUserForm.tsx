'use client'

import { useReducer, useState } from 'react';
import {
  Button,
  Callout,
  Flex,
  Heading,
  IconButton,
  Text,
  TextField
} from '@radix-ui/themes';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { createFormReducer } from '@/app/lib/logic/FormReducerFactory';
import Form from 'next/form';
import { NewUserResponse, NewUserSchema } from '@/app/lib/types/user';

const { reducer, initialState } = createFormReducer(NewUserSchema, {
  firstName: '',
  lastName: '',
  email: '',
  password: ''
});

export default function CreateUserForm() {
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = async () => {
    setPending(true);

    const result = NewUserSchema.safeParse(state.values);
    if (!result.success) {
      dispatch({
        type: 'SET_ERRORS',
        errors: result.error.flatten().fieldErrors
      });
      setPending(false);
      return;
    }

    dispatch({
      type: 'SET_ERRORS',
      errors: {}
    });

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.values)
      });

      const data: NewUserResponse = await res.json();

      if (!res.ok || !data.success) {
        if ('errors' in data) {
          dispatch({ type: 'SET_ERRORS', errors: data.errors });
        } else {
          dispatch({ type: 'SET_MESSAGE', message: data.message });
        }
      } else {
        dispatch({ type: 'SET_MESSAGE', message: data.message });
      }
    } catch (err) {
      console.error('Network error:', err);
    }

    setPending(false);
  };

  return (
      <Flex direction="column" gap="4" width="100%" maxWidth="360px" asChild>
        <Form action={handleSubmit}>
          <Heading>Create new user</Heading>

          {/* First Name */}
          <Flex direction="column">
            <Text as="label" htmlFor="firstName" mb="1">
              First name
            </Text>
            <TextField.Root
                id="firstName"
                name="firstName"
                placeholder="e.g. Edna"
                value={state.values.firstName}
                onChange={(e) =>
                    dispatch({
                      type: 'CHANGE',
                      field: 'firstName',
                      value: e.target.value
                    })
                }
            />
            {state.errors?.firstName && (
                <Text size="2" mt="2" color="red">
                  {state.errors.firstName[0]}
                </Text>
            )}
          </Flex>

          {/* Last Name */}
          <Flex direction="column">
            <Text as="label" htmlFor="lastName" mb="1">
              Last name
            </Text>
            <TextField.Root
                id="lastName"
                name="lastName"
                placeholder="e.g. Mode"
                value={state.values.lastName}
                onChange={(e) =>
                    dispatch({
                      type: 'CHANGE',
                      field: 'lastName',
                      value: e.target.value
                    })
                }
            />
            {state.errors?.lastName && (
                <Text size="2" mt="2" color="red">
                  {state.errors.lastName[0]}
                </Text>
            )}
          </Flex>

          {/* Email */}
          <Flex direction="column">
            <Text as="label" htmlFor="email" mb="1">
              Email
            </Text>
            <TextField.Root
                id="email"
                name="email"
                type="email"
                placeholder="e.g. abc123@student.bham.ac.uk"
                value={state.values.email}
                onChange={(e) =>
                    dispatch({
                      type: 'CHANGE',
                      field: 'email',
                      value: e.target.value
                    })
                }
            />
            {state.errors?.email && (
                <Text size="2" mt="2" color="red">
                  {state.errors.email[0]}
                </Text>
            )}
          </Flex>

          {/* Password */}
          <Flex direction="column">
            <Text as="label" htmlFor="password" mb="1">
              Password
            </Text>
            <TextField.Root
                id="password"
                name="password"
                placeholder="Enter a password"
                type={visible ? 'text' : 'password'}
                value={state.values.password}
                onChange={(e) =>
                    dispatch({
                      type: 'CHANGE',
                      field: 'password',
                      value: e.target.value
                    })
                }
            >
              <TextField.Slot side="right">
                <IconButton
                    size="1"
                    variant="ghost"
                    onClick={() => setVisible((v) => !v)}
                    type="button"
                >
                  {visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </IconButton>
              </TextField.Slot>
            </TextField.Root>
            {state.errors?.password && (
                <Flex direction="column" mt="2">
                  <Text size="2" color="red">
                    Password must:
                  </Text>
                  <ul>
                    {state.errors.password.map((error) => (
                        <Text asChild size="2" color="red" key={error}>
                          <li>{error}</li>
                        </Text>
                    ))}
                  </ul>
                </Flex>
            )}
          </Flex>

          {state.message && (
              <Callout.Root>
                <Callout.Text>{state.message}</Callout.Text>
              </Callout.Root>
          )}

          <Button loading={pending} type="submit" mt="4">
            Create user
          </Button>
        </Form>
      </Flex>
  );
}