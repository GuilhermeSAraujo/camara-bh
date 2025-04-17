import React, { useState, useEffect, useRef } from 'react';
import { VolumeX, Pause, Play, Settings } from 'lucide-react';

export const TextToSpeech = ({ text, language = 'pt-BR' }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  // Usar refs para manter referências estáveis
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);
  const contentRef = useRef(text);
  const isPlayingRef = useRef(false);

  // Atualizar o conteúdo quando o texto mudar
  useEffect(() => {
    contentRef.current = text;
  }, [text]);

  // Inicializar o sintetizador de voz
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      console.error('Este navegador não suporta a API de síntese de voz.');
      return;
    }

    // Inicializar o sintetizador
    synthRef.current = window.speechSynthesis;

    // Função para carregar vozes
    const loadVoices = () => {
      try {
        const availableVoices = synthRef.current.getVoices();

        // Filtrar por vozes no idioma desejado, se disponível
        const langVoices = availableVoices.filter((voice) =>
          voice.lang.startsWith(language.split('-')[0])
        );

        setVoices(langVoices.length > 0 ? langVoices : availableVoices);

        // Selecionar voz padrão
        if (langVoices.length > 0) {
          setSelectedVoice(langVoices[0]);
        } else if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar vozes:', error);
      }
    };

    // Chrome requer este evento para carregar vozes
    synthRef.current.onvoiceschanged = loadVoices;

    // Carregar vozes imediatamente (para Firefox/Safari)
    loadVoices();

    // Limpar ao desmontar
    return () => {
      try {
        if (synthRef.current) {
          synthRef.current.cancel();
          isPlayingRef.current = false;
        }
      } catch (error) {
        console.error('Erro ao limpar síntese de voz:', error);
      }
    };
  }, [language]);

  // Função segura para parar a narração
  const stopSpeaking = () => {
    try {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      utteranceRef.current = null;
      isPlayingRef.current = false;
      setIsSpeaking(false);
      setIsPaused(false);
    } catch (error) {
      console.error('Erro ao parar narração:', error);
    }
  };

  // Iniciar a narração
  const startSpeaking = () => {
    try {
      if (!synthRef.current) return;

      // Cancelar qualquer narração anterior
      stopSpeaking();

      // Criar nova utterance
      const utterance = new SpeechSynthesisUtterance(contentRef.current);

      // Configurar a utterance
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.lang = language;
      utterance.rate = rate;
      utterance.pitch = pitch;

      // Configurar callbacks
      utterance.onstart = () => {
        isPlayingRef.current = true;
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        isPlayingRef.current = false;
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        // Ignorar erros de 'interrupted' que são esperados quando cancelamos ou iniciamos nova narração
        if (event.error !== 'interrupted') {
          console.error('Erro de síntese de voz:', event);
        }

        // Resetar o estado apenas se não for devido a uma interrupção planejada
        if (event.error !== 'interrupted' || !isPlayingRef.current) {
          isPlayingRef.current = false;
          setIsSpeaking(false);
          setIsPaused(false);
          utteranceRef.current = null;
        }
      };

      // Armazenar a referência e iniciar a narração
      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    } catch (error) {
      console.error('Erro ao iniciar narração:', error);
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  // Alternar entre reproduzir e pausar
  const togglePlayPause = () => {
    try {
      // Se não há sintetizador, não fazer nada
      if (!synthRef.current) return;

      // Se já está falando
      if (isSpeaking) {
        // Tente pausar se possível
        if (!isPaused) {
          // Alguns navegadores não suportam pause/resume
          // Verificar se os métodos existem antes de chamá-los
          if (typeof synthRef.current.pause === 'function') {
            synthRef.current.pause();
            setIsPaused(true);
          } else {
            // Fallback: apenas pare a narração
            stopSpeaking();
          }
        }
        // Se está pausado, tente retomar
        else if (typeof synthRef.current.resume === 'function') {
          synthRef.current.resume();
          setIsPaused(false);
        } else {
          // Fallback: reinicie a narração
          startSpeaking();
        }
      }
      // Se não está falando, inicie a narração
      else {
        startSpeaking();
      }
    } catch (error) {
      console.error('Erro ao alternar reprodução:', error);
      // Resetar para um estado consistente em caso de erro
      stopSpeaking();
    }
  };

  // Verificar se o navegador suporta síntese de voz
  if (!('speechSynthesis' in window)) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Botões de controle */}
      <div className="flex items-center gap-2 rounded-full bg-green-500 p-3 text-white shadow-lg">
        <button
          onClick={togglePlayPause}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-green-500 transition-colors hover:bg-gray-100"
          aria-label={
            isSpeaking && !isPaused ? 'Pausar narração' : 'Iniciar narração'
          }
          title={
            isSpeaking && !isPaused ? 'Pausar narração' : 'Iniciar narração'
          }
        >
          {isSpeaking && !isPaused ? <Pause size={20} /> : <Play size={20} />}
        </button>

        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-green-500 transition-colors hover:bg-gray-100"
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
    </div>
  );
};

// HOC para adicionar TTS a qualquer componente
export const withTextToSpeech = (Component) => (props) => {
  const [textContent, setTextContent] = useState('');
  const containerRef = React.useRef(null);

  // Obter o texto do conteúdo renderizado
  useEffect(() => {
    const extractText = () => {
      if (containerRef.current) {
        try {
          // Extrair texto de todos os elementos visíveis, excluindo elementos que devem ser ignorados
          const text = Array.from(
            containerRef.current.querySelectorAll(
              'p, h1, h2, h3, h4, h5, h6, span, li'
            )
          )
            .filter((el) => {
              // Verificar se o elemento é visível e não tem a classe 'no-tts'
              const style = window.getComputedStyle(el);
              return (
                style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                !el.classList.contains('no-tts')
              );
            })
            .map((el) => el.textContent)
            .join(' ');

          setTextContent(text);
        } catch (error) {
          console.error('Erro ao extrair texto para narração:', error);
        }
      }
    };

    // Extrair texto após a renderização
    extractText();

    // Adicionar um observador para detectar mudanças no DOM
    const observer = new MutationObserver(extractText);

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [props]);

  return (
    <div ref={containerRef}>
      <Component {...props} />
      <TextToSpeech text={textContent} />
    </div>
  );
};
