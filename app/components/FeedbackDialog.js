import { Loader2, Send } from 'lucide-react';
import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/Dialog';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Textarea } from './ui/Textarea';

export function FeedbackDialog({ open, onClose }) {
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedbackForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const feedbackCreationPromise = Meteor.callAsync('Feedbacks.create', {
      email: feedbackForm?.email,
      name: feedbackForm?.name,
      feedback: feedbackForm?.message,
    });

    toast.promise(feedbackCreationPromise, {
      loading: 'Enviando feedback...',
      success: () => 'Feedback enviado com sucesso. Muito obrigado!',
      error: `Erro ao enviar feedback. Por favor, tente novamente em alguns minutos.`,
    });

    feedbackCreationPromise.then(() => {
      setIsLoading(false);

      setFeedbackForm({
        name: '',
        email: '',
        message: '',
      });

      onClose();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Envie sua sugestão</DialogTitle>
          <DialogDescription>
            Compartilhe suas ideias para melhorarmos nossos serviços. Seu
            feedback é muito importante para nós.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmitFeedback}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                name="name"
                value={feedbackForm.name}
                onChange={handleInputChange}
                className="col-span-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={feedbackForm.email}
                onChange={handleInputChange}
                className="col-span-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Mensagem
              </Label>
              <Textarea
                id="message"
                name="message"
                value={feedbackForm.message}
                onChange={handleInputChange}
                className="col-span-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="flex items-center gap-2 bg-green-500 text-white hover:bg-green-600"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Send size={16} />
              )}
              Enviar feedback
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
