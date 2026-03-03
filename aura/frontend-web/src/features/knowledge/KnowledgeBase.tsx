import { useState } from 'react';
import { Upload, File, Check, X, Loader2, Database } from 'lucide-react';
import { uploadFile } from '../../services/upload';
import { motion, AnimatePresence } from 'framer-motion';

export const KnowledgeBase = () => {
    const [uploads, setUploads] = useState<Array<{ id: string, name: string, progress: number, status: string }>>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleUpload = async (files: FileList | null) => {
        if (!files) return;

        Array.from(files).forEach(async (file) => {
            const uploadId = Date.now().toString() + file.name;
            setUploads(prev => [...prev, { id: uploadId, name: file.name, progress: 0, status: 'uploading' }]);

            try {
                await uploadFile(file, (progress) => {
                    setUploads(prev => prev.map(u =>
                        u.id === uploadId ? { ...u, progress } : u
                    ));
                });

                setUploads(prev => prev.map(u =>
                    u.id === uploadId ? { ...u, status: 'processing', progress: 100 } : u
                ));

                // Simulate backend processing/indexing
                setTimeout(() => {
                    setUploads(prev => prev.map(u =>
                        u.id === uploadId ? { ...u, status: 'indexed' } : u
                    ));
                }, 2000);

            } catch (err) {
                setUploads(prev => prev.map(u =>
                    u.id === uploadId ? { ...u, status: 'error' } : u
                ));
            }
        });
    };

    return (
        <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
            <div className="mb-10 text-left">
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Database className="text-indigo-400" />
                    Knowledge Base
                </h2>
                <p className="text-gray-400">Upload documents to enhance AURA's local context and RAG capabilities.</p>
            </div>

            {/* Drag & Drop Area */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleUpload(e.dataTransfer.files); }}
                className={`relative border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-500/5 scale-[1.01]' : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
            >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <Upload className="text-gray-400" size={28} />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Click to upload or drag & drop</h3>
                <p className="text-sm text-gray-500">Support for PDF, TXT, MD and DOCX (Max 25MB)</p>
                <input
                    type="file"
                    multiple
                    onChange={(e) => handleUpload(e.target.files)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
            </div>

            {/* Upload Progress List */}
            <div className="mt-12 space-y-4 text-left">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 font-sans">Recent Documents</h4>
                <AnimatePresence>
                    {uploads.length === 0 && (
                        <p className="text-sm text-gray-600 italic">No documents indexed yet.</p>
                    )}
                    {uploads.map((upload) => (
                        <motion.div
                            key={upload.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="glass p-5 rounded-2xl border border-white/10 flex items-center gap-4"
                        >
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <File className="text-indigo-400" size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-sm font-medium text-white truncate">{upload.name}</p>
                                    <span className="text-[10px] uppercase font-bold tracking-tighter text-gray-500">
                                        {upload.status}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${upload.progress}%` }}
                                        className={`h-full ${upload.status === 'error' ? 'bg-red-500' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'}`}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                {upload.status === 'indexed' ? (
                                    <Check size={18} className="text-green-500" />
                                ) : upload.status === 'error' ? (
                                    <X size={18} className="text-red-500" />
                                ) : (
                                    <Loader2 size={18} className="animate-spin text-gray-500" />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
