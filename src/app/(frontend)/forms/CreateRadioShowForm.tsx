'use client'

import React, {FormEventHandler, useReducer, useState} from 'react';
import {
  Button,
  Callout,
  Flex,
  Heading,
  Text,
  TextField,
  TextArea, Card, Box
} from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { createFormReducer } from '@/app/lib/logic/FormReducerFactory';
import { createRadioShowAction } from '@/app/api/radio-shows/radioShowAction';
import { RadioShowSchema } from "@/app/lib/types/RadioShow";
import TagInput from "@/app/(frontend)/components/TagInput";
import ImageInput from "@/app/(frontend)/components/ImageInput";

const { reducer, initialState } = createFormReducer(RadioShowSchema, {
  title: '',
  description: '',
  hosts: [],
  photo: undefined,
});

type Props = {
  onSuccess?: () => void;
};

export default function CreateRadioShowForm({ onSuccess }: Props) {
  const [pending, setPending] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setPending(true);
    dispatch({ type: 'SET_ERRORS', errors: {} });

    // Prepare FormData
    const formData = new FormData();
    formData.append('title', state.values.title);
    if (state.values.description) formData.append('description', state.values.description);
    formData.append('hosts', JSON.stringify(state.values.hosts));
    if (state.values.photo) formData.append('photo', state.values.photo);

    const result = await createRadioShowAction(formData);
    console.log(result);
    if (result.success) {
      dispatch({ type: 'SET_MESSAGE', message: result.message });
      if (onSuccess) onSuccess(); // Trigger dialog close + form reset
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
          <Heading>Create new Radio Show</Heading>

          {/* Title */}
          <Flex direction="column">
            <Text as="label" htmlFor="title" mb="1">Title</Text>
            <TextField.Root
                id="title"
                name="title"
                placeholder="e.g. The Burn Show"
                value={state.values.title}
                onChange={(e) =>
                    dispatch({
                      type: 'CHANGE',
                      field: 'title',
                      value: e.target.value,
                    })
                }
            />
            {state.errors?.title && (
                <Text size="2" mt="2" color="red">
                  {state.errors.title.join(", ")}
                </Text>
            )}
          </Flex>

          {/* Description */}
          <Flex direction="column">
            <Text as="label" htmlFor="description" mb="1">Description</Text>
            <TextArea
                id="description"
                name="description"
                placeholder="e.g. Introducing The Burn Show - a refreshing take on..."
                value={state.values.description}
                onChange={(e) =>
                    dispatch({
                      type: 'CHANGE',
                      field: 'description',
                      value: e.target.value,
                    })
                }
            />
            {state.errors?.description && (
                <Text size="2" mt="2" color="red">
                  {state.errors.description.join(", ")}
                </Text>
            )}
          </Flex>

          {/* Hosts */}
          <TagInput
              label="Hosts"
              tags={state.values.hosts}
              onChange={(newHosts) =>
                  dispatch({
                    type: 'CHANGE',
                    field: 'hosts',
                    value: newHosts,
                  })
              }
              error={state.errors?.hosts}
              placeholder="e.g. Edna Mode"
          />

          {/* Photo Upload */}
          <ImageInput
              label="Radio Show Artwork"
              onChange={(file) =>
                  dispatch({ type: 'CHANGE', field: 'photo', value: file ?? undefined })
              }
              error={state.errors?.photo}
          />

          {/* Message / Error Feedback */}
          {state.message && (
              <Callout.Root>
                <Callout.Icon><InfoCircledIcon /></Callout.Icon>
                <Callout.Text>{state.message}</Callout.Text>
              </Callout.Root>
          )}

          {/* Submit Button */}
          <Button loading={pending} type="submit" mt="4">
            Create Radio Show
          </Button>
            </Flex>
          </form>
        </Box>
      </Card>
  );
}