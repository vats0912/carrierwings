'use client'
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import { LoaderCircle } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import { chatSession } from '@/utils/GEMIAI'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs'
import moment from 'moment/moment'
import { useRouter } from 'next/navigation'

function Addinterview() {

    const [openDialog,setOpenDialog]=useState(false)
    const [jobPosition,setJobPosition]=useState("")
    const [jobDescription,setJobDescription]=useState("")
    const [jobExperience,setJobExperience]=useState(0)
    const [loading,setLoading]=useState(false)
    const [jsonMockResponse,setJsonMockResponse]=useState([])

    const {user}=useUser()
    const router=useRouter()
    const onSubmit=async(e)=>{
        e.preventDefault()
        setLoading(true)
        const InputPrompt="Job Role:"+jobPosition+  " , Job Description: "+jobDescription+" ,Years of experience:"+jobExperience+". Generate "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTIONS_COUNT+" interview questions with answers based on these fields and decide difficulty of questions based on years of experience.Generate in JSON format only.Only generate questions in which code is not required "
        
        const result=await chatSession.sendMessage(InputPrompt)
        const MockResponse = (result.response.text())
        .replace("```json", "")
        .replace("```", "");

        console.log(JSON.parse(MockResponse))
        
        setJsonMockResponse(MockResponse)

       if(MockResponse){
        const res=await db.insert(MockInterview).values({
           mockId:uuidv4(),
           jsonMockResp:MockResponse,
           jobPosition:jobPosition,
           jobDescription:jobDescription,
           jobExperience:jobExperience,
           createdBy:user?.primaryEmailAddress?.emailAddress,
           createdAt:moment().format('DD-MM-YYYY')
        }).returning({mockId:MockInterview.mockId})

        if(res){
          setOpenDialog(false)
          router.push(`/dashboard/interview/${res[0]?.mockId}`)
        }
      }

      

      else{
        console.log('Error 404')
      }
        setLoading(false)
    }

  return (
    <div>
        <div className='p-15 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'>
            <h2 className='text-lg font-bold text-center  hover:scale-105 hover:shadow-md cursor-pointer transition-all' onClick={()=>setOpenDialog(true)}>+ Add new</h2>
        </div>

<Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogContent className='max-w-2xl'>
    <DialogHeader>
      <DialogTitle  className='text-2xl'>Tell us more about the Job you are interviewing</DialogTitle>
      <DialogDescription>
        <form onSubmit={onSubmit}>
        <div>
            <h2>Add details about your job position/role,job description and years of experience </h2>
            <div className='mt-7 my-3'>
             <label >Job Role/Job Position</label>
             <Input placeholder='Ex:Full Stack Developer' onChange={(event)=>setJobPosition(event.target.value)} required/>
            </div>

            <div className=' my-3'>
             <label>Job Description/Tech Stack (In short)</label>
             <Textarea placeholder='Ex:React,Python,SQL,NodeJs etc' onChange={(event)=>setJobDescription(event.target.value)} required/>
            </div>

            <div className='my-3'>
             <label>Years of Experience</label>
             <Input placeholder='Ex:2' type='number' max='50' onChange={(event)=>setJobExperience(event.target.value)} required/>
            </div>

        </div>
        
        
        <div className='flex gap-5 justify-end'>
            <Button type='button' variant='ghost' onClick={()=>setOpenDialog(false)}>Cancel</Button>
            <Button type='submit' disabled={loading} >
                {
                    loading ?
                    <> 
        {typeof window !== "undefined" && <LoaderCircle className='animate-spin' />}

                    "Generating from AI"
                    </>
                    :"Start Interview"
                }
                 </Button>
        </div>
        </form>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  )
}

export default Addinterview