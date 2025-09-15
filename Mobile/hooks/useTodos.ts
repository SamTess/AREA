import { useState, useCallback } from 'react';
import { IToDo } from '../interfaces/IToDo.interface';

export function useTodos() {
  const [value, setValue] = useState<string>('');
  const [toDoList, setToDos] = useState<IToDo[]>([]);
  const [error, showError] = useState<boolean>(false);

  const handleSubmit = useCallback((): void => {
    if (value.trim()) {
      setToDos(prev => [...prev, { text: value, completed: false }]);
      showError(false);
    } else {
      showError(true);
    }
    setValue('');
  }, [value]);

  const removeItem = useCallback((index: number): void => {
    setToDos(prev => prev.filter((_, i) => i !== index));
  }, []);

  const toggleComplete = useCallback((index: number): void => {
    setToDos(prev =>
      prev.map((item, i) => (i === index ? { ...item, completed: !item.completed } : item))
    );
  }, []);

  return {
    value,
    setValue,
    toDoList,
    error,
    handleSubmit,
    removeItem,
    toggleComplete,
    showError,
  } as const;
}
