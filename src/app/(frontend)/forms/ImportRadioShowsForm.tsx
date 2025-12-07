'use client'

import React, {FormEventHandler, useReducer, useState} from 'react';
import {
  Button,
  Callout,
  Flex,
  Heading,
  Card, Box
} from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { createFormReducer } from '@/app/lib/logic/FormReducerFactory';
import { importRadioShowsAction } from '@/app/api/radio-shows/radioShowAction';
import {RadioShowUploadSchema} from "@/app/lib/types/RadioShow";
import FileInput from "@/app/(frontend)/components/FileInput";

const { reducer, initialState } = createFormReducer(RadioShowUploadSchema, {
  file: File,
});

type Props = {
  onSuccess?: () => void;
};

export default function ImportRadioShowsForm({ onSuccess }: Props) {
  const [pending, setPending] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setPending(true);
    dispatch({ type: 'SET_ERRORS', errors: {} });

    // Prepare FormData
    const formData = new FormData();
    formData.append('file', state.values.file);

    const result = await importRadioShowsAction(formData);
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
              <Heading>Import Radio Shows from a json file</Heading>

              {/* File Upload */}
              <FileInput
                  label="Radio Show archive file (.json file)"
                  onChange={(file) =>
                      dispatch({ type: 'CHANGE', field: 'file', value: file ?? undefined })
                  }
                  acceptableEndings={[".json"]}
                  error={state.errors?.file}
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
                Import Radio Shows
              </Button>
            </Flex>
          </form>
        </Box>
      </Card>
  );
}