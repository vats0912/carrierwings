'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/utils/db'
import { eq } from 'drizzle-orm'
import { MockInterview } from '@/utils/schema' 
import QuestionSection from './_components/QuestionSection'
import RecordAnswers from './_components/RecordAnswers'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
function Start() {
    const params = useParams();
    const id = params?.interviewId;
    
    const [questions, setQuestions] = useState(null);
    const [interviewData, setInterviewData] = useState(null);
    const [activequestionIndex,setActivequestionIndex]=useState(0)
    const handleNextQuestion = () => {
        setActivequestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
      };

    useEffect(() => {
        const fetchInterview = async () => {
            if (!id) return;
                const res = await db.select().from(MockInterview).where(eq(MockInterview.mockId, id));
                const jsonMock=JSON.parse(res[0].jsonMockResp) 
                setQuestions(jsonMock)
                setInterviewData(res[0])
        };

        fetchInterview();
    }, [id]); 

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                 <QuestionSection questions={questions} activequestionIndex={activequestionIndex} onNextQuestion={handleNextQuestion} />
                 <RecordAnswers questions={questions} activequestionIndex={activequestionIndex} interviewData={interviewData}/>
            </div>

            <div className='flex justify-end gap-6'>
                {activequestionIndex>0 && <Button className='bg-purple-500' onClick={()=>setActivequestionIndex(activequestionIndex-1)}>Previous</Button>}
                {activequestionIndex!=questions?.length-1 && <Button className='bg-purple-500' onClick={()=>setActivequestionIndex(activequestionIndex+1)}>Next</Button>}
                {activequestionIndex==questions?.length-1 && 
                <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}><Button className='bg-purple-500'>End Interview</Button> </Link>}
            </div>
        </div>
    );
}

export default Start;
