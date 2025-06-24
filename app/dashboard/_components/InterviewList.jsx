'use client'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { eq,desc } from 'drizzle-orm'
import React,{useEffect, useState} from 'react'
import InterviewCard from './InterviewCard'

function InterviewList() {
  const {user}=useUser()
  const [interviewList,setInterviewList]=useState([])
  useEffect(()=>{
   user && GetInterviewList()
  },[user])

  const GetInterviewList=async()=>{
     const res=await db.select().from(MockInterview).where(eq(user?.primaryEmailAddress?.emailAddress,MockInterview.createdBy)).orderBy(desc(MockInterview.id))
     setInterviewList(res);
  }
  return (
    <div>
      <h2 className='font-medium text-xl'>Previous Mock Interviews:</h2>
      <div className='my-3 gap-3 '>
        {interviewList ? interviewList.map((interview,index)=>(
          <InterviewCard key={index} interview={interview} />
        )):<h2 className='font-medium text-xl'>No Previous Interview found</h2>}
      </div>
    </div>

    
  )

}

export default InterviewList