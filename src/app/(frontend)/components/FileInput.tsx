'use client';

import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
} from '@radix-ui/themes';
import {
  Cross1Icon,
  Pencil2Icon,
  UploadIcon,
  FileIcon
} from '@radix-ui/react-icons';

interface FileInputProps {
  label?: string;
  onChange?: (file: File | null | "") => void;
  error?: string[];
  acceptableEndings?: string[]; // e.g. ['.json']
}

export default function FileInput({
                                    label,
                                    onChange,
                                    error,
                                    acceptableEndings = [],
                                  }: FileInputProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build accept string (".json,.txt")
  const acceptString = acceptableEndings.join(',');

  const fileHasValidEnding = (filename: string) => {
    if (acceptableEndings.length === 0) return true;
    return acceptableEndings.some(ext =>
        filename.toLowerCase().endsWith(ext.toLowerCase())
    );
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && fileHasValidEnding(droppedFile.name)) {
      updateFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && fileHasValidEnding(selectedFile.name)) {
      updateFile(selectedFile);
    }
  };

  const updateFile = (newFile: File) => {
    setFile(newFile);
    onChange?.(newFile);
  };

  const removeFile = () => {
    setFile(null);
    onChange?.(null);
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
            accept={acceptString}
            style={{ display: 'none' }}
            onChange={handleFileChange}
        />

        {!file ? (
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
                <Text size="2">Drag & drop a file here</Text>
                <Text size="1" color="gray">
                  or click to browse
                </Text>

                {acceptableEndings.length > 0 && (
                    <Text size="1" color="gray">
                      Accepted: {acceptableEndings.join(', ')}
                    </Text>
                )}
              </Flex>
            </Box>
        ) : (
            <Flex direction="column" align="center" gap="2">
              <Box
                  p="3"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '200px',
                  }}
              >
                <FileIcon width="32" height="32" />
                <Text size="2" mt="2" style={{ wordBreak: 'break-all', textAlign: 'center' }}>
                  {file.name}
                </Text>
              </Box>

              <Flex gap="2" mt="2">
                <Button size="1" onClick={openFilePicker} variant="soft">
                  <Pencil2Icon />
                  Change
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