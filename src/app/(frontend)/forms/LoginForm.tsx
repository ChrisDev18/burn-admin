'use client';

import {FormEventHandler, useReducer, useState} from 'react';
import {
  Box,
  Button,
  Callout, Card,
  Flex,
  Heading,
  IconButton,
  Link,
  Popover,
  Text,
  TextField,
} from '@radix-ui/themes';
import {EyeClosedIcon, EyeOpenIcon, InfoCircledIcon} from '@radix-ui/react-icons';
import { createFormReducer } from '@/app/lib/logic/FormReducerFactory';
import { LoginSchema } from '@/app/lib/types/auth';
import {loginAction} from "@/app/api/auth/login/loginAction";

const { reducer, initialState } = createFormReducer(LoginSchema, {
  email: '',
  password: '',
});

export default function LoginForm() {
  const [pending, setPending] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [visible, setVisible] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

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
      <Card asChild>
        <Box width="100%" maxWidth="440px" >
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="4" p="2">
              <Heading align="center" mt="4">Log in</Heading>

              {/* Email Field */}
              <Flex direction="column">
                <Flex justify="between" align="center">
                  <Text as="label" htmlFor="email" mb="1">
                    Email
                  </Text>
                  <Popover.Root>
                    <Popover.Trigger>
                      <Link size="2" href="#">
                        Which email do I use?
                      </Link>
                    </Popover.Trigger>
                    <Popover.Content size="1" maxWidth="300px">
                      <Text as="p" trim="both" size="2">
                        Most committee members&#39; accounts will be linked to their Guild email. <br/> <br/>
                        If you have forgotten which email you are meant to use, contact the Head of Tech.
                      </Text>
                    </Popover.Content>
                  </Popover.Root>
                </Flex>
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
                <Flex justify="between" align="center">
                  <Text as="label" htmlFor="password" mb="1">
                    Password
                  </Text>
                  <Popover.Root>
                    <Popover.Trigger>
                      <Link size="2" href="#">
                        Forgotten password?
                      </Link>
                    </Popover.Trigger>
                    <Popover.Content size="1" maxWidth="300px">
                      <Text as="p" trim="both" size="2">
                        Contact the Head of Tech, they can change your password.
                      </Text>
                    </Popover.Content>
                  </Popover.Root>
                </Flex>
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
                  <Callout.Root>
                    <Callout.Icon><InfoCircledIcon /></Callout.Icon>
                    <Callout.Text>{state.message}</Callout.Text>
                  </Callout.Root>
              )}

              <Button loading={pending} type="submit" mt="4">
                Log in
              </Button>

              <Popover.Root>
                <Popover.Trigger>
                  <Link size="2" href="#">
                    <Text align="center">How do I sign up?</Text>
                  </Link>
                </Popover.Trigger>
                <Popover.Content size="1" maxWidth="300px">
                  <Text as="p" trim="both" size="2">
                    Only committee members have access the Burn Admin Panel.
                    If you think you should have access and don&#39;t, contact the Head of Tech.
                  </Text>
                </Popover.Content>
              </Popover.Root>
            </Flex>
          </form>
        </Box>
      </Card>

  );
}