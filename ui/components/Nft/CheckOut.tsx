import React, {Fragment} from 'react'
import { Dialog, Transition } from "@headlessui/react";
import PaymentSchedule from './PaymentSchedule'

type EditPostProps = {
    isOpen: boolean;
    closeModal: Function;
};

const CheckOut = ({isOpen, closeModal}: EditPostProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                    <Dialog.Panel className="text-white w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-900 font-satoshi p-6 text-left align-middle shadow-xl transition-all">
                    <div className="text-xl font-bold mb-4 text-center">Complete Checkout</div>
                    <div className="flex">
                        <img className="w-1/3 rounded-2xl mb-4 mr-6"
                            src="doodles.png"
                        />
                        <div className="w-full">
                            <div className="flex justify-between w-full">
                                <div>
                                    <div className="text-2xl font-bold">Doodles #8876</div>
                                    <div className="text-gray-400 font-medium">Doodles Collection</div>
                                </div>
                                <div className="pt-2 w-1/3">
                                    <div className="text-gray-400 text-sm">Base Price</div>
                                    <div className="text-xl font-bold">3.59 ETH</div>
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-300 font-bold mt-4 mb-4">BNPL Terms</div>
                                <div className="flex max-w-sm justify-between">
                                    <div>
                                        <div className="text-gray-400 text-xs mb-1">Min. Down Payment</div>
                                        <div className="font-bold">3 ETH</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-xs mb-1">Loan Duration</div>
                                        <div className="font-bold">30 Days</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-xs mb-1">Interest (APR)</div>
                                        <div className="font-bold">5.00%</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-xs mb-1">Total BNPL Price</div>
                                        <div className="font-bold">1.18 ETH</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="font-bold">Payment Schedule</div>
                    <PaymentSchedule/>
                    <div className="flex mt-2 justify-center">
                        <div>
                            <button className="bg-corsair font-semibold py-3 px-8 border border-corsair rounded-2xl mr-8">
                                Make Down Payment
                            </button>
                            <button className="bg-transparent font-semibold py-3 px-16 border border-spritzig rounded-2xl hover:bg-spritzig">
                                Cancel
                            </button>
                        </div>
                    </div>
                    </Dialog.Panel>
                </Transition.Child>
                </div>
            </div>
        </Dialog>            
    </Transition>
  )
}

export default CheckOut