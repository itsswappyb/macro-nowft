import React from "react";
import PaymentTable from "./PaymentTable";

const InstallmentCard = () => {
    return (
        <div className="text-white w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-900 font-satoshi p-6 text-left align-middle shadow-xl transition-all mb-12">
            <div className="flex">
                <img className="w-1/3 rounded-2xl mb-4 mr-6" src="doodles.png" />
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
                                <div className="text-gray-400 text-xs mb-1">Minimum Deposit</div>
                                <div className="font-bold">3 ETH</div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-xs mb-1">
                                    Loan Duration (weeks)
                                </div>
                                <div className="font-bold">30 Days</div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-xs mb-1">
                                    Interest (on Price)
                                </div>
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
            <PaymentTable />
        </div>
    );
};

export default InstallmentCard;
