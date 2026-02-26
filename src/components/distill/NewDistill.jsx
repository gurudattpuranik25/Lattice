import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FileText, Youtube, Globe, FileType, Type, X, AlertTriangle, Loader2, Upload, Sparkles, Eye, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { extractContent, detectSourceType, extractYouTubeId } from '../../services/contentExtractor';
import { processWithClaude } from '../../services/claudeService';
import { createDistill } from '../../services/firestoreService';
import { getTextPreview, formatFileSize } from '../../utils/textTruncator';
import { usePageTitle } from '../../hooks/usePageTitle';
import DropZone from '../dashboard/DropZone';
import FormatSelector from './FormatSelector';
import ProcessingScreen from './ProcessingScreen';

const stepperSteps = [
  { num: 1, label: 'Upload', icon: Upload },
  { num: 2, label: 'Format', icon: Sparkles },
  { num: 3, label: 'Generate', icon: Eye },
];

function Stepper({ currentStep }) {
  const stepNum = typeof currentStep === 'number' ? currentStep : 1;

  return (
    <div className="flex items-center justify-center mb-10">
      {stepperSteps.map((s, i) => {
        const isCompleted = stepNum > s.num;
        const isActive = stepNum === s.num;
        const Icon = s.icon;

        return (
          <div key={s.num} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: isActive ? 1.05 : 1,
                  backgroundColor: isCompleted
                    ? 'rgba(52, 211, 153, 0.15)'
                    : isActive
                    ? 'rgba(129, 140, 248, 0.15)'
                    : 'rgba(39, 39, 42, 1)',
                }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 rounded-full flex items-center justify-center relative"
              >
                {isCompleted ? (
                  <Check size={18} className="text-emerald-400" />
                ) : (
                  <Icon size={18} className={isActive ? 'text-indigo-400' : 'text-zinc-600'} />
                )}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-indigo-400/30"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
              <span className={`text-xs mt-1.5 font-medium transition-colors duration-300 ${
                isCompleted ? 'text-emerald-400' : isActive ? 'text-indigo-300' : 'text-zinc-600'
              }`}>
                {s.label}
              </span>
            </div>

            {/* Connector line */}
            {i < stepperSteps.length - 1 && (
              <div className="w-16 sm:w-24 h-[2px] mx-2 mb-5 rounded-full overflow-hidden bg-zinc-800">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: '0%' }}
                  animate={{
                    width: isCompleted ? '100%' : '0%',
                    backgroundColor: isCompleted ? '#34D399' : '#818CF8',
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function NewDistill() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  usePageTitle('New Distill');
  const [step, setStep] = useState(1);
  const [extracting, setExtracting] = useState(false);
  const [input, setInput] = useState(null);
  const [sourceType, setSourceType] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [sourceInfo, setSourceInfo] = useState({});
  const [textInput, setTextInput] = useState('');
  const [showTextArea, setShowTextArea] = useState(false);
  const [processingStep, setProcessingStep] = useState('received');
  const [error, setError] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);

  // YouTube manual fallback state
  const [ytFallback, setYtFallback] = useState(false);
  const [ytManualText, setYtManualText] = useState('');
  const [ytUrl, setYtUrl] = useState('');

  // Handle pre-loaded file or URL from dashboard
  useEffect(() => {
    if (location.state?.file) {
      handleInput(location.state.file);
    } else if (location.state?.url) {
      handleInput(location.state.url);
    }
  }, [location.state]);

  const handleInput = async (inputValue) => {
    setInput(inputValue);
    const type = detectSourceType(inputValue);
    setSourceType(type);
    setExtracting(true);

    try {
      setProcessingStep('extracting');
      const result = await extractContent(inputValue);
      setExtractedText(result.text);
      setSourceInfo(result.sourceInfo);
      setExtracting(false);
      setStep(2);
    } catch (err) {
      setExtracting(false);
      // Special case: YouTube couldn't be reached, show manual paste UI
      if (err.message === 'YOUTUBE_NEEDS_MANUAL_INPUT') {
        setYtUrl(inputValue);
        setYtFallback(true);
        setStep('yt-fallback');
        return;
      }
      toast.error(err.message);
      setStep(1);
    }
  };

  const handleYtManualSubmit = () => {
    if (ytManualText.trim().length < 50) {
      toast.error('Please enter at least 50 characters.');
      return;
    }
    const videoId = extractYouTubeId(ytUrl);
    setExtractedText(ytManualText.trim());
    setSourceType('youtube');
    setSourceInfo({ url: ytUrl, videoId });
    setInput(ytUrl);
    setYtFallback(false);
    setStep(2);
  };

  const handleFileSelect = (file) => handleInput(file);
  const handleUrlSubmit = (url) => handleInput(url);

  const handleTextSubmit = () => {
    if (textInput.trim().length < 50) {
      toast.error('Please enter at least 50 characters of text.');
      return;
    }
    handleInput(textInput.trim());
  };

  const handleFormatSelect = async (format) => {
    if (format === 'auto') format = 'keyTakeaways';
    setSelectedFormat(format);
    setStep(3);
    setError(null);

    try {
      setProcessingStep('processing');

      const output = await processWithClaude(extractedText, format);

      setProcessingStep('building');
      await new Promise(r => setTimeout(r, 800));

      const distillId = await createDistill(user.uid, {
        title: output.title || sourceInfo.fileName || 'Untitled',
        sourceType,
        sourceInfo,
        extractedTextPreview: getTextPreview(extractedText),
        outputFormat: format,
        outputs: { [format]: output },
      });

      setProcessingStep('done');
      await new Promise(r => setTimeout(r, 1000));

      navigate(`/dashboard/distill/${distillId}`);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleRetry = () => {
    setError(null);
    if (selectedFormat) {
      handleFormatSelect(selectedFormat);
    }
  };

  const sourceIcons = { pdf: FileText, youtube: Youtube, url: Globe, docx: FileType, text: Type };
  const SourceIcon = sourceIcons[sourceType] || Type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto py-8"
    >
      {/* Stepper */}
      <Stepper currentStep={typeof step === 'number' ? step : 1} />

      {step === 1 && (
        <div className="space-y-6 relative">
          {/* Extracting overlay */}
          {extracting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-20 bg-zinc-950/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-white font-medium text-sm">Extracting content...</p>
                <p className="text-zinc-500 text-xs mt-1">
                  {sourceType === 'youtube' ? 'Fetching video transcript' :
                   sourceType === 'pdf' ? 'Reading PDF pages' :
                   sourceType === 'url' ? 'Fetching article' :
                   sourceType === 'docx' ? 'Parsing document' :
                   'Processing your content'}
                </p>
              </div>
            </motion.div>
          )}

          <div className="mb-8">
            <h1 className="font-heading font-bold text-3xl text-white mb-2 flex items-center gap-3">
              <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-indigo-400 to-violet-500" />
              New Distill
            </h1>
            <p className="text-zinc-400 leading-relaxed">Drop content and let AI transform it into visual knowledge</p>
          </div>

          <DropZone onFileSelect={handleFileSelect} onUrlSubmit={handleUrlSubmit} />

          <div className="text-center">
            <button
              onClick={() => setShowTextArea(!showTextArea)}
              className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors"
            >
              Or paste text directly
            </button>
          </div>

          {showTextArea && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste your article, notes, or any text content here..."
                className="w-full h-48 bg-zinc-900 border border-white/5 rounded-xl p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/40 resize-none"
              />
              <button
                onClick={handleTextSubmit}
                disabled={textInput.trim().length < 50}
                className="btn-primary mt-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Process Text
              </button>
            </motion.div>
          )}

          <div className="flex items-center justify-center gap-3 pt-4">
            {['PDF', 'DOCX', 'TXT', 'YouTube', 'URL'].map(type => (
              <span key={type} className="text-xs text-zinc-600 px-2 py-1 rounded-md bg-zinc-900 border border-white/5">
                {type}
              </span>
            ))}
          </div>
          <p className="text-xs text-zinc-600 text-center">Max 20MB for files</p>
        </div>
      )}

      {/* YouTube manual fallback */}
      {step === 'yt-fallback' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass-card p-5 flex items-start gap-4 border-amber-500/20">
            <AlertTriangle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-medium mb-1">Couldn't auto-extract from YouTube</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                YouTube is blocking automated requests. You can paste the video's transcript or
                description below and we'll process it for you.
              </p>
            </div>
          </div>

          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Youtube size={18} className="text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">{ytUrl}</div>
              <div className="text-xs text-zinc-500">YouTube Video</div>
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-300 mb-2 block font-medium">
              Paste the video transcript or description
            </label>
            <p className="text-xs text-zinc-500 mb-3">
              Tip: On YouTube, click "...more" under the video, then click "Show transcript"
              to copy the transcript. Or paste the video description.
            </p>
            <textarea
              value={ytManualText}
              onChange={(e) => setYtManualText(e.target.value)}
              placeholder="Paste transcript or description here..."
              className="w-full h-56 bg-zinc-900 border border-white/5 rounded-xl p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/40 resize-none"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setStep(1); setYtFallback(false); setYtManualText(''); }}
              className="btn-secondary"
            >
              Go Back
            </button>
            <button
              onClick={handleYtManualSubmit}
              disabled={ytManualText.trim().length < 50}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue with this text
            </button>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
              <SourceIcon size={18} className="text-zinc-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">
                {input instanceof File ? input.name : input}
              </div>
              <div className="text-xs text-zinc-500">
                {input instanceof File ? formatFileSize(input.size) : sourceType}
              </div>
            </div>
            <button onClick={() => { setStep(1); setInput(null); }} className="p-1 text-zinc-500 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <FormatSelector onSelect={handleFormatSelect} recommended={['keyTakeaways', 'mindMap']} />
        </div>
      )}

      {step === 3 && (
        <ProcessingScreen
          currentStep={processingStep}
          format={selectedFormat}
          sourceType={sourceType}
          error={error}
          onRetry={handleRetry}
        />
      )}
    </motion.div>
  );
}
