"use client";
import { Button, Card, Title, Text, Group, Container } from "@mantine/core";
import { useState, useEffect } from "react";
// import axios from "axios";
import { apiService } from '@/services/apiService';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [myVar, setMyVar] = useState<Post | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<Post>('/posts/2');
      setMyVar(response);
    } catch (error) {
      console.error('Erreur lors de la requête GET:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container size="sm" py="xl">
      <Card shadow="md" padding="lg" radius="md" withBorder>
        <Group justify="space-between" style={{ marginBottom: '1rem' }}>
          <Title order={2}>Bienvenue sur la page d'accueil Mantine</Title>
        </Group>
        <Text style={{ marginBottom: '1rem' }}>
          Poc mantine avec service API
        </Text>
        <Group gap="md">
          <Button color="blue">Bouton de Mantine</Button>
          <Button variant="outline" color="green">Bouton en plus </Button>
        </Group>
        {loading && <Text>...</Text>}
        {myVar && (
          <Card mt="md" shadow="sm" padding="sm" radius="md" withBorder>
            <Title order={3}>Données récupérées :</Title>
            <Text><strong>Titre:</strong> {myVar.title}</Text>
            <Text><strong>Corps:</strong> {myVar.body}</Text>
          </Card>
        )}
      </Card>
    </Container>
  );
}