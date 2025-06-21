import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Users, 
  TrendingUp, 
  Shield, 
  Download, 
  Share2,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface Score {
  category: string;
  score: number;
  maxScore: number;
  feedback: string;
  suggestions: string[];
}

interface Receipt {
  id: string;
  timestamp: string;
  hash: string;
  verified: boolean;
}

interface ScoreDisplayProps {
  scores: Score[];
  receipt?: Receipt;
  onReset: () => void;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ scores, receipt, onReset }) => {
  const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
  const maxTotalScore = scores.reduce((sum, score) => sum + score.maxScore, 0);
  const percentage = Math.round((totalScore / maxTotalScore) * 100);

  const getScoreColor = (score: number, maxScore: number) => {
    const percent = (score / maxScore) * 100;
    if (percent >= 80) return 'text-green-400';
    if (percent >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number, maxScore: number) => {
    const percent = (score / maxScore) * 100;
    if (percent >= 80) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (percent >= 60) return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    return <AlertCircle className="w-5 h-5 text-red-400" />;
  };

  const categoryIcons: { [key: string]: React.ReactNode } = {
    'Problem Statement': <Target className="w-6 h-6" />,
    'Market Analysis': <TrendingUp className="w-6 h-6" />,
    'Solution Clarity': <Trophy className="w-6 h-6" />,
    'Team Strength': <Users className="w-6 h-6" />,
    'Financial Projections': <TrendingUp className="w-6 h-6" />,
    'Competitive Advantage': <Shield className="w-6 h-6" />
  };

  return (
    <div className="space-y-8">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <div className="text-4xl font-bold text-white">{percentage}%</div>
          </div>
          <div className="absolute -top-2 -right-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Overall Score</h2>
        <p className="text-white/70 text-lg">
          {percentage >= 80 ? 'Excellent pitch!' : 
           percentage >= 60 ? 'Good pitch with room for improvement' : 
           'Needs significant improvement'}
        </p>
      </motion.div>

      {/* Individual Scores */}
      <div className="grid gap-6">
        {scores.map((score, index) => (
          <motion.div
            key={score.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                  {categoryIcons[score.category] || <Info className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-semibold text-white">{score.category}</h3>
              </div>
              <div className="flex items-center gap-2">
                {getScoreIcon(score.score, score.maxScore)}
                <span className={`text-2xl font-bold ${getScoreColor(score.score, score.maxScore)}`}>
                  {score.score}/{score.maxScore}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="w-full bg-white/10 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(score.score / score.maxScore) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-white font-medium mb-2">Feedback</h4>
                <p className="text-white/70">{score.feedback}</p>
              </div>
              
              {score.suggestions.length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-2">Suggestions</h4>
                  <ul className="space-y-1">
                    {score.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-white/70 text-sm flex items-start gap-2">
                        <span className="text-indigo-400 mt-1">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Receipt */}
      {receipt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-green-500/10 border border-green-400/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Analysis Receipt</h3>
            {receipt.verified && <CheckCircle className="w-5 h-5 text-green-400" />}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/70">Receipt ID:</span>
              <p className="text-white font-mono">{receipt.id}</p>
            </div>
            <div>
              <span className="text-white/70">Timestamp:</span>
              <p className="text-white">{receipt.timestamp}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-white/70">Verification Hash:</span>
              <p className="text-white font-mono text-xs break-all">{receipt.hash}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
        >
          <Download className="w-5 h-5" />
          Download Report
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all"
        >
          <Share2 className="w-5 h-5" />
          Share Results
        </motion.button>
        
        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Analyze Another
        </motion.button>
      </div>
    </div>
  );
};

export default ScoreDisplay;
