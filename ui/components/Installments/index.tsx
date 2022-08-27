import React from 'react'
import InstallmentCard from './InstallmentCard'

const Installments = () => {

  return (
    <div className="px-2 py-2 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4 px-4 sm:px-0">
        <div className="mt-8 mb-5">
            <h3 className="font-semibold text-2xl text-center">
                Your Installments
            </h3>
        </div>
        <div className="mt-6 mb-12 px-4 md:px-12">
          <div className="flex justify-center">
            <div>
                <InstallmentCard/>
                <InstallmentCard/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Installments