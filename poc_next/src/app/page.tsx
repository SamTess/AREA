"use client";
import { Button, Container } from '@mantine/core';
import React from "react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleNavigation = () => {
    router.push('/home');
  };

  return (
    <Container size="sm" py={32} style={{ display: 'flex', justifyContent: 'center' }}>
      <Button color="teal" variant="outline" onClick={handleNavigation}> Page home</Button>
    </Container>
  );
}