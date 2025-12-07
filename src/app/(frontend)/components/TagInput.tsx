'use client';

import React, { useState, KeyboardEvent, useRef } from 'react';
import {Text, TextField, Flex, Badge, Button, Box} from '@radix-ui/themes';
import { Cross2Icon } from '@radix-ui/react-icons';

type TagInputProps = {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  error?: string[];
  placeholder?: string;
};

export default function TagInput({
                                   label,
                                   tags,
                                   onChange,
                                   error,
                                   placeholder = "e.g. Edna Mode",
                                 }: TagInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
      setInput('');
    }
  };

  return (
      <Flex direction="column" gap="1">
        {label && (
            <Text as="label" mb="1">
              {label}
            </Text>
        )}

        <Flex gap="2">
          <TextField.Root
              style={{ width: '100%' }}
              mb="1"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
          />

          <Button
              onClick={() => {
                addTag(input);
                setInput('');
              }}
              disabled={!input.trim()}
          >
            Add
          </Button>
        </Flex>

        <Flex wrap="wrap" gap="1">
          {tags.map((tag, index) => (
              <Button key={index} size="2" variant="outline" onClick={() => removeTag(tag)}>
                {tag}
                <Cross2Icon/>
              </Button>
          ))}
        </Flex>

        {error && (
            <Text size="2" color="red">
              {error.join(', ')}
            </Text>
        )}
      </Flex>
  );
}