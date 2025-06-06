'use client'

import {useReducer, useState} from 'react'
import {Button, Callout, Flex, Heading, IconButton, Text, TextField} from "@radix-ui/themes";
import {EyeClosedIcon, EyeOpenIcon} from "@radix-ui/react-icons";
import {NewUserSchema} from "@/app/lib/types/auth";

type FormState = {
  errors?: {
    firstName?: string[]
    lastName?: string[]
    email?: string[]
    password?: string[]
    general?: string[]
  }
  message?: string
}

type Action = {
  type: 'SET_ERRORS';
  errors: {
    firstName?: string[]
    lastName?: string[]
    email?: string[]
    password?: string[]
    general?: string[]
  }
} | {
  type: 'CLEAR_ERRORS'
} | {
  type: 'SET_SUCCESS';
  message: string
}

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case 'SET_ERRORS':
      return { ...state, errors: action.errors }
    case 'CLEAR_ERRORS':
      return { ...state, errors: undefined }
    default:
      return state
  }
}

export default function CreateUserForm() {
  const [visible, setVisible] = useState(false)
  const [pending, setPending] = useState(false)
  const [state, dispatch] = useReducer(reducer, {})

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    const rawData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
    }

    const result = NewUserSchema.safeParse(rawData)

    if (!result.success) {
      dispatch({ type: 'SET_ERRORS', errors: result.error.flatten().fieldErrors })
      return
    }

    dispatch({ type: 'CLEAR_ERRORS' })
    setPending(true)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setPending(false)

      if (!response.ok) {
        if (data.errors) {
          dispatch({ type: 'SET_ERRORS', errors: data.errors })
        } else {
          dispatch({
            type: 'SET_ERRORS',
            errors: { general: [data.message || 'Something went wrong'] },
          })
        }
      } else {
        // form.reset()
        dispatch({
          type: 'SET_SUCCESS',
          message: `User created successfully with id ${data.id}`,
        })
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
      <Flex direction="column" gap="4" width="100%" maxWidth="360px" asChild>
        <form onSubmit={handleSubmit}>
          <Heading>Create new user</Heading>

          <Flex direction="column">
            <Text as="label" htmlFor="firstName" mb="1">
              First name
            </Text>
            <TextField.Root id="firstName" name="firstName" placeholder="e.g. Edna" />
            {state.errors?.firstName && (
                <Text size="2" mt="2" color="red">
                  {state.errors.firstName[0]}
                </Text>
            )}
          </Flex>

          <Flex direction="column">
            <Text as="label" htmlFor="lastName" mb="1">
              Last name
            </Text>
            <TextField.Root id="lastName" name="lastName" placeholder="e.g. Mode" />
            {state.errors?.lastName && (
                <Text size="2" mt="2" color="red">
                  {state.errors.lastName[0]}
                </Text>
            )}
          </Flex>

          <Flex direction="column">
            <Text as="label" htmlFor="email" mb="1">
              Email
            </Text>
            <TextField.Root id="email" name="email" placeholder="e.g. abc123@student.bham.ac.uk" />
            {state.errors?.email && (
                <Text size="2" mt="2" color="red">
                  {state.errors.email[0]}
                </Text>
            )}
          </Flex>

          <Flex direction="column">
            <Text as="label" htmlFor="password" mb="1">
              Password
            </Text>
            <TextField.Root id="password" name="password" type={visible ? 'text' : 'password'}>
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

          {state.errors?.general && (
              <Callout.Root color="red">
                <Callout.Text>{state.errors.general.join(", ")}</Callout.Text>
              </Callout.Root>
          )}

          {state.message && (
              <Callout.Root color="blue">
                <Callout.Text>{state.message}</Callout.Text>
              </Callout.Root>
          )}

          <Button disabled={pending} type="submit" mt="4">
            {pending ? 'Creating...' : 'Create user'}
          </Button>
        </form>
      </Flex>
  )
}