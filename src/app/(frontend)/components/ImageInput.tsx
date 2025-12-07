'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
} from '@radix-ui/themes';
import { Cross1Icon, Pencil2Icon, UploadIcon } from '@radix-ui/react-icons';

interface ImageInputProps {
  label?: string;
  onChange?: (file: File | null | "") => void;
  error?: string[];
  initialUrl?: string | null; // 👈 new prop
}

export default function ImageInput({ label, onChange, error, initialUrl }: ImageInputProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialUrl && !file) {
      setPreviewUrl(initialUrl);
    }
  }, [initialUrl, file]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      updateFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      updateFile(selectedFile);
    }
  };

  const updateFile = (newFile: File) => {
    setFile(newFile);
    const objectUrl = URL.createObjectURL(newFile);
    setPreviewUrl(objectUrl);
    onChange?.(newFile);
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    // If there was an initial URL, we want to mark this as "removed"
    if (initialUrl) {
      onChange?.("");
    } else {
      onChange?.(null);
    }
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  return (
      <Flex direction="column" gap="1">
        {label && (
            <Text as="label" mb="1">
              {label}
            </Text>
        )}

        <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
        />

        {!previewUrl ? (
            <Box
                onClick={openFilePicker}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                p="4"
                style={{
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: dragOver ? '#f0f0f0' : 'transparent',
                  textAlign: 'center',
                }}
            >
              <Flex direction="column" align="center" gap="2">
                <UploadIcon width="24" height="24" />
                <Text size="2">Drag & drop a photo here</Text>
                <Text size="1" color="gray">or click to browse</Text>
              </Flex>
            </Box>
        ) : (
            <Flex direction="column" align="center" gap="2">
              <Box
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #ccc',
                  }}
              >
                <img
                    src={previewUrl}
                    alt="Selected"
                    style={{ width: '100%', display: 'block' }}
                />
              </Box>
              <Flex gap="2" mt="2">
                <Button size="1" onClick={openFilePicker} variant="soft">
                  <Pencil2Icon />
                  Change Photo
                </Button>
                <Button size="1" color="red" variant="soft" onClick={removeFile}>
                  <Cross1Icon />
                  Remove
                </Button>
              </Flex>
            </Flex>
        )}

        {error && (
            <Text size="2" color="red">
              {error.join(', ')}
            </Text>
        )}
      </Flex>
  );
}