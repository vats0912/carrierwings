'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
function feedback() {
    const router=useRouter()
    const params=useParams()
    const id=params.interviewId
    const [feedbackList,setFeedbackList]=useState([]);
    useEffect(()=>{
      if(id){
        Getfeedback()
      }
    },[])
    const Getfeedback=async()=>{
       const res=await db.select().from(UserAnswer).where(eq(UserAnswer.mockIdRef,id)).orderBy(UserAnswer.id)
       setFeedbackList(res);
    }

    const totalRating = feedbackList.reduce((sum, item) => sum + parseFloat(item.rating), 0);
    const finalRating=totalRating/5;
    
    
  return (
    <div className='my-10'>
   {feedbackList.length==0 ?
    <h2>No Interview Record Found</h2>
  :
<>
   <h2 className='text-3xl font-bold text-green-500 my-2'>Congratulations!</h2>
   <h2 className='text-2xl font-bold my-2'>Here is your feedback:</h2>
   <h2 className='text-blue-500 font-bold text-2xl'>Your overall interview rating is : <strong>{finalRating}</strong></h2>
   <h2 className='my-3 font-bold text-md text-gray-500'>Find below interview question along with your answer,correct answer and feedback for improvement</h2>

   {feedbackList && feedbackList.map((item,index)=>(
    <Collapsible key={index}>
    <CollapsibleTrigger className='p-2 my-2 bg-secondary rounded-lg text-left flex justify-between'>{item.question} <ChevronsUpDown/></CollapsibleTrigger>
    <CollapsibleContent>
      <div className='flex flex-col gap-2'>
        <h2 className='text-blue-500 p-2 border rounded-lg'>Rating : <strong > {item.rating}</strong></h2>
        <h2 className='border rounded-lg text-sm p-2 bg-amber-50 text-red-500'><strong className='text-black'>Your Answer :</strong> {item.userAns}</h2>
        <h2 className='border rounded-lg text-sm p-2 bg-amber-50 text-green-500'><strong className='text-black'>Correct Answer :</strong> {item.correctAns}</h2>
        <h2 className='border rounded-lg text-sm p-2 bg-amber-50 text-purple-500'><strong className='text-black'>Feedback :</strong> {item.feedback}</h2>
      </div>
    </CollapsibleContent>
  </Collapsible>
  
   ))}

</>
}

   <Button onClick={()=>router.replace('/dashboard')} className='bg-blue-500 cursor-pointer my-4'>Go Home</Button>
    </div>
  )
}

export default feedback