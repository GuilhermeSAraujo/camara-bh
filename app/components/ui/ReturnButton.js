import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

export function ReturnButton() {
  const navigate = useNavigate();

  return (
    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Voltar
    </Button>
  );
}
