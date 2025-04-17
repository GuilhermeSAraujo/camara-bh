import { Pause, Play, VolumeX } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const TextToSpeech = ({ text, language = 'pt-BR' }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [synth, setSynth] = useState(null);

  useEffect(() => {
    // Verificar se o navegador suporta a API de síntese de voz
    if (!('speechSynthesis' in window)) {
      console.error('Este navegador não suporta a API de síntese de voz.');
      return;
    }

    const speechSynth = window.speechSynthesis;
    setSynth(speechSynth);

    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.lang = language;
    newUtterance.rate = 1.0;
    newUtterance.pitch = 1.0;

    // Eventos para controlar o estado da fala
    newUtterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    newUtterance.onerror = (event) => {
      console.error('Erro de síntese de fala:', event);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    setUtterance(newUtterance);

    // Limpeza ao desmontar o componente
    return () => {
      speechSynth.cancel();
    };
  }, [text, language]);

  const handleSpeak = () => {
    if (!synth) return;

    if (isSpeaking && !isPaused) {
      synth.pause();
      setIsPaused(true);
    } else if (isSpeaking && isPaused) {
      synth.resume();
      setIsPaused(false);
    } else {
      // Cancelar qualquer fala anterior
      synth.cancel();
      synth.speak(utterance);
      setIsSpeaking(true);
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    if (!synth) return;

    synth.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Verificar se o navegador suporta a API
  if (!synth) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-primary p-3 text-white shadow-lg">
      <button
        onClick={handleSpeak}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary transition-colors hover:bg-gray-100"
        aria-label={
          isSpeaking && !isPaused ? 'Pausar narração' : 'Iniciar narração'
        }
        title={isSpeaking && !isPaused ? 'Pausar narração' : 'Iniciar narração'}
      >
        {isSpeaking && !isPaused ? <Pause size={20} /> : <Play size={20} />}
      </button>

      {isSpeaking && (
        <button
          onClick={handleStop}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary transition-colors hover:bg-gray-100"
          aria-label="Parar narração"
          title="Parar narração"
        >
          <VolumeX size={20} />
        </button>
      )}

      <span className="ml-1 mr-2 text-sm font-medium">
        {isSpeaking
          ? isPaused
            ? 'Narração pausada'
            : 'Narrando...'
          : 'Ler conteúdo'}
      </span>
    </div>
  );
};

// HOC para adicionar TTS a qualquer componente
export const withTextToSpeech = (Component) => (props) => {
  const [textContent, setTextContent] = useState('');
  const containerRef = React.useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Extrair texto de todos os elementos visíveis
      const text = Array.from(
        containerRef.current.querySelectorAll(
          'p, h1, h2, h3, h4, h5, h6, span, li'
        )
      )
        .filter((el) => {
          // Verificar se o elemento é visível
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden';
        })
        .map((el) => el.textContent)
        .join(' ');

      setTextContent(text);
    }
  }, [props]);

  return (
    <div ref={containerRef}>
      <Component {...props} />
      <TextToSpeech text={textContent} />
    </div>
  );
};
