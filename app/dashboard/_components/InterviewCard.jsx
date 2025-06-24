import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
function InterviewCard({interview}) {
    const router=useRouter()
    const onStart=()=>{router.push(`/dashboard/interview/${interview?.mockId}`)}
    const onFeedback=()=>{router.push(`/dashboard/interview/${interview?.mockId}/feedback`)}

  return (
    <div className='border rounded-lg shadow-sm p-3'>
      <h2 className='font-bold text-purple-500'>{interview?.jobPosition}</h2>
      <h2 className='text-sm text-gray-500'>{interview?.jobExperience} Years of Experience</h2>
      <h2 className='text-sm text-gray-500'>Created at : {interview?.createdAt} </h2>
      <div className='flex justify-between mt-2 '>
        <Button size='sm' variant='outline' className='cursor-pointer hover:bg-green-400'  onClick={onFeedback} >Feedback</Button>
        <Button size='sm' className='bg-purple-500 cursor-pointer'  onClick={onStart}>Start</Button>
      </div>
    </div>
  )
}

export default InterviewCard