import { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChat } from '../../hooks/useChat';

interface VoiceAssistantProps {
    onClose: () => void;
}

export const VoiceAssistant = ({ onClose }: VoiceAssistantProps) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const recognitionRef = useRef<any>(null);
    const { sendMessage, isLoading } = useChat();

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
                let interim = '';
                let final = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final += event.results[i][0].transcript;
                    } else {
                        interim += event.results[i][0].transcript;
                    }
                }

                setTranscript(prev => prev + final);
                setInterimTranscript(interim);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setTranscript('');
            setInterimTranscript('');
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const handleSend = async () => {
        const fullText = transcript + interimTranscript;
        if (!fullText.trim()) return;

        recognitionRef.current?.stop();
        await sendMessage(fullText);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/95 backdrop-blur-2xl p-6"
        >
            <button
                onClick={onClose}
                className="absolute top-8 right-8 p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
                <X size={24} />
            </button>

            <div className="max-w-xl w-full flex flex-col items-center gap-12 text-center">
                {/* Visualizer Circle */}
                <div className="relative">
                    <motion.div
                        animate={isListening ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`w-32 h-32 rounded-full border-2 flex items-center justify-center transition-colors duration-500 ${isListening ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5'
                            }`}
                    >
                        {isListening ? (
                            <Mic size={48} className="text-indigo-400" />
                        ) : (
                            <MicOff size={48} className="text-gray-500" />
                        )}

                        {/* Pulsing rings */}
                        {isListening && [1, 2, 3].map(i => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0.5, scale: 1 }}
                                animate={{ opacity: 0, scale: 2 }}
                                transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                                className="absolute inset-0 rounded-full border border-indigo-500/50"
                            />
                        ))}
                    </motion.div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {isListening ? 'AURA is listening...' : 'Voice Mode'}
                    </h2>
                    <p className="text-gray-400 min-h-[4rem] text-lg font-medium leading-relaxed">
                        {transcript || interimTranscript || 'Speak now or tap the mic to start...'}
                        <span className="text-indigo-400/50">{interimTranscript ? ' ' + interimTranscript : ''}</span>
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={toggleListening}
                        className={`px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-3 ${isListening
                                ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'
                                : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700'
                            }`}
                    >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        {isListening ? 'Stop' : 'Start'}
                    </button>

                    <button
                        onClick={handleSend}
                        disabled={!(transcript || interimTranscript) || isLoading}
                        className="px-8 py-3 rounded-2xl bg-aura-gradient text-white font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-3 active:scale-95"
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        Send Response
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
