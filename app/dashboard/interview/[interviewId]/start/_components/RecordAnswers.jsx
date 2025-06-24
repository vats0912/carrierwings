'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { chatSession } from "@/utils/GEMIAI"
import { db } from "@/utils/db"
import { UserAnswer } from "@/utils/schema"
import moment from "moment/moment"
import { useUser } from "@clerk/nextjs"

function RecordAnswers({ questions, activequestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser()

  const {
    error,
    results,
    isRecording,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // Update the answer only with latest transcript (prevents repetitive appending)
  useEffect(() => {
    if (results.length > 0) {
      setUserAnswer(results.map(r => r.transcript).join(' '))
    }
  }, [results]);

  // Display error toast if speech recognition fails
  useEffect(() => {
    if (error) {
      console.error("Speech recognition error:", error);
      toast.error("Speech recognition error occurred. Try again.");
    }
  }, [error]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      setTimeout(() => {
        if (userAnswer.length > 2) {
          updateAnswersInDb();
        } else {
          toast.warning("Answer too short to submit.");
        }
      }, 1000); // slight delay to ensure results are finalized
    } else {
      setUserAnswer('');
      setResults([]);
      startSpeechToText();
    }
  }

  const updateAnswersInDb = async () => {
    try {
      setLoading(true);
      const currentQuestion = questions[activequestionIndex];

      const feedbackPrompt = `Question: ${currentQuestion?.question}, User answer: ${userAnswer}. Based on the question and answer, rate the answer out of 5 and give feedback in 3 to 5 lines in JSON format with 'rating' and 'feedback' fields.`;
      const result = await chatSession.sendMessage(feedbackPrompt);
      const MockResponse = (result.response.text())
        .replace("```json", "")
        .replace("```", "");

      const jsonFeedbackResp = JSON.parse(MockResponse);

      const res = await db.insert(UserAnswer).values({
        mockIdRef: interviewData.mockId,
        question: currentQuestion?.question,
        correctAns: currentQuestion?.answer,
        userAns: userAnswer,
        feedback: jsonFeedbackResp?.feedback,
        rating: jsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-YYYY'),
      });

      if (res) {
        toast.success('Answer recorded and evaluated successfully.');
        setUserAnswer('');
        setResults([]);
      }
    } catch (err) {
      console.error("Error saving answer:", err);
      toast.error("Failed to save answer. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex justify-center items-center flex-col'>
      <div className='flex flex-col mt-20 items-center justify-center p-5 rounded-lg bg-black relative'>
        <Image className='absolute' src={'/webcam.png'} height={200} width={200} alt='webcam frame' />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: '100%',
            zIndex: 10,
          }}
        />
      </div>

      <Button disabled={loading} variant='outline' className='my-10' onClick={StartStopRecording}>
        {isRecording ? (
          <h2 className='flex gap-3 text-blue-600'><StopCircle /> Stop Recording</h2>
        ) : (
          <h2 className='flex gap-2 text-green-600 hover:cursor-pointer'><Mic /> Record Answer</h2>
        )}
      </Button>

      {userAnswer && (
        <div className='w-full max-w-xl p-4 text-sm bg-gray-100 rounded-lg'>
          <strong className='block mb-2'>Transcribed Answer:</strong>
          <p className='text-gray-800 whitespace-pre-wrap'>{userAnswer}</p>
        </div>
      )}
    </div>
  )
}

export default RecordAnswers
