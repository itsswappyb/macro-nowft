import React, {Fragment} from 'react'
import { Dialog, Transition } from "@headlessui/react";

type EditPostProps = {
    isOpen: boolean;
    closeModal: Function;
};

const EditPost = ({isOpen, closeModal}: EditPostProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={closeModal}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Dialog.Panel className="text-white w-full max-w-2xl transform overflow-hidden rounded-lg bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                    <div className="text-gray-400 mb-4">Edit Listing</div>
                    <form className="w-full">
                        <div className="md:flex md:items-center mb-4">
                          <div className="md:w-1/4">
                            <label className="text-sm block font-medium mb-1 md:mb-0 pr-4">
                              Price:
                            </label>
                          </div>
                          <div className="md:w-3/4">
                            <input className="bg-gray-700 text-gray-400 rounded w-full py-2 px-4 leading-tight" 
                              type="text" 
                              value="Price"
                            />
                          </div>
                        </div>
                        <div className="md:flex md:items-center mb-4">
                          <div className="md:w-1/4">
                            <label className="text-sm block font-medium mb-1 md:mb-0 pr-4">
                              BNPL Terms:
                            </label>
                          </div>
                          <div className="md:w-3/4 flex">
                            <input className="bg-gray-700 text-gray-400 rounded w-full py-2 px-4 leading-tight mr-2" 
                              type="text" 
                              value="DP"
                            />
                            <input className="bg-gray-700 text-gray-400 rounded w-full py-2 px-4 leading-tight mr-2" 
                              type="text" 
                              value="Duration"
                            />
                            <input className="bg-gray-700 text-gray-400 rounded w-full py-2 px-4 leading-tight" 
                              type="text" 
                              value="Interest"
                            />
                          </div>
                        </div>
                        <div className="md:flex md:items-center mb-4">
                          <div className="md:w-1/4">
                            <label className="text-sm block font-medium mb-1 md:mb-0 pr-4">
                              Offer Duration:
                            </label>
                          </div>
                          <div className="md:w-3/4">
                            <input className="bg-gray-700 text-gray-400 rounded w-full py-2 px-4 leading-tight" 
                              type="text" 
                              value="Duration (Days)"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button className="bg-spritzig hover:bg-corsair font-semibold py-3 px-12 rounded-2xl">
                            Update
                          </button>
                        </div>
                      </form>
                    </Dialog.Panel>
                </Transition.Child>
                </div>
            </div>
        </Dialog>            
    </Transition>
  )
}

export default EditPost