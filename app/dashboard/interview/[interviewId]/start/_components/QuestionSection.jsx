'use client'
import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'
import { useEffect,useState } from 'react'



function QuestionSection({ questions, activequestionIndex,onNextQuestion }) {
  const [timeLeft, setTimeLeft] = useState(90);

  const handleTextToSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(questions[activequestionIndex]?.question || '');
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech.");
    }
  };

  const speakText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  }


  useEffect(() => {
    setTimeLeft(90);
    if (questions?.[activequestionIndex]?.question) {
      speakText(questions[activequestionIndex].question);
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (activequestionIndex < questions.length - 1) {
            onNextQuestion();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); 
  }, [activequestionIndex, questions]);

  // Format MM:SS
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  useEffect(() => {
    if (questions?.[activequestionIndex]?.question) {
      speakText(questions[activequestionIndex].question);
    }
  }, [activequestionIndex, questions]);

  return Array.isArray(questions) && (
    <div className='p-5 border rounded-lg my-5'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 transition-all'>
        {
          questions.map((question, index) => (
            <h2
              key={index}
              className={`p-2 bg-cyan-200 rounded-full text-sm md:text-sm text-center ${
                activequestionIndex === index && 'bg-purple-400'
              } hover:cursor-pointer transition-all`}
            >
              Question #{index + 1}
            </h2>
          ))
        }
      </div>

      <h2 className='my-7 text-md lg:text-lg'>
        {questions[activequestionIndex]?.question}
      </h2>

      <div className='mt-8 flex items-center gap-8'>
      <Volume2 className='cursor-pointer' onClick={handleTextToSpeech} />
      <span className='text-red-600 font-mono text-xl animate-pulse transition-all duration-500 ease-in-out'>
        <strong className='text-black'>Time left:</strong> {formatTime(timeLeft)}
  </span>
  </div>
      <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
        <h2 className='flex gap-2 items-center text-blue-700'>
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className='my-2 text-blue-700 text-sm'>{process.env.NEXT_PUBLIC_INFO}</h2>
      </div>
    </div>
  )
}

export default QuestionSection
