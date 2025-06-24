'use client'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { WebcamIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Lightbulb } from 'lucide-react'
import { eq } from 'drizzle-orm'
import { useParams } from 'next/navigation'  
import Link from 'next/link'
function Interview() {
    const params=useParams()
    const id=params.interviewId
    const[interviewData,setInterviewData]=useState()
    const [webcamOn,setWebCamOn]=useState(false)

    useEffect(()=>{ 
        console.log(id)
        GetInterview()
    },[])

   const GetInterview=async()=>{
   const res=await db.select().from(MockInterview).where(eq(MockInterview.mockId,id))
   setInterviewData(res[0])
   console.log(interviewData)
}

  return (
    
    <div className='my-10 '>
        <h2 className='font-bold text-2xl'>Lets Get Started</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'> 
      
    <div className='flex flex-col my-5 gap-5'>
        <div className='flex flex-col gap-5 p-5 rounded-lg border'>
        <h2 className='text-lg'><strong>Job Role/Position:</strong>{interviewData?.jobPosition}</h2>
        <h2 className='text-lg'><strong>Job Description/Tech Stack:</strong>{interviewData?.jobDescription}</h2>
        <h2 className='text-lg'><strong>Year of Experience:</strong>{interviewData?.jobExperience}</h2>
        </div>

        <div className='p-5 border-yellow-300 border rounded-lg bg-yellow-100'>
            <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/><strong>Information</strong></h2>
            <h2 className='text-yellow-500 mt-3'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
        </div>
    </div>

    <div>
          {
            webcamOn ? <Webcam mirrored={true} onUserMedia={()=>setWebCamOn(true)} onUserMediaError={()=>setWebCamOn(false)} style={{height:500,width:500}}/>
          
        :
        <>
        <WebcamIcon className='h-72 w-full p-20 bg-secondary rounded-lg border'/> 
        <Button  onClick={()=>{setWebCamOn(true)}} className='hover:bg-green-500 bg-purple-500 w-full my-7 hover:cursor-pointer'>Enable Webcam and microphone</Button>
        </>
          }
    </div>
</div>

    <div className='flex justify-end items-end'>
      <Link href={`${id}/start`}>
        <Button className='bg-blue-500 hover:cursor-pointer'>Start Interview</Button>
      </Link>
    </div>
    </div>

  )
}

export default Interview