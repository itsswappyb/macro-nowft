import React from 'react'

const PaymentSchedule = () => {
  return (
    <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
                <table className="min-w-full text-sm">
                <thead className="font-bold text-gray-400">
                    <tr>
                    <th scope="col" className="w-1/3 font-medium px-6 py-4 text-left"/>
                    <th scope="col" className="w-1/3 font-medium px-6 py-1 text-left">
                        Date
                    </th>
                    <th scope="col" className="text-sm font-medium px-6 py-1 text-left">
                        Amount
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="odd:bg-gray-800">
                        <td className="px-6 py-1 whitespace-nowrap text-sm font-medium text-spritzig">
                            Down Payment
                        </td>
                        <td className="text-sm px-6 py-2 whitespace-nowrap font-medium">
                            August 1, 2022
                        </td>
                        <td className="text-sm px-6 py-2 whitespace-nowrap font-medium">
                            0.4 ETH
                        </td>
                    </tr>
                    <tr className="odd:bg-gray-800">
                        <td className="px-6 py-1 whitespace-nowrap text-sm font-medium text-spritzig">
                            Payment 1
                        </td>
                        <td className="text-sm px-6 py-2 whitespace-nowrap font-medium">
                            August 8, 2022
                        </td>
                        <td className="flex text-sm px-6 py-2 whitespace-nowrap font-medium">
                            0.26 ETH
                            <div className="text-xs text-gray-400 ml-1 my-auto">(incl. 30% APR)</div>
                        </td>
                    </tr>
                    <tr className="odd:bg-gray-800">
                        <td className="px-6 py-1 whitespace-nowrap text-sm font-medium text-spritzig">
                            Payment 2
                        </td>
                        <td className="text-sm px-6 py-2 whitespace-nowrap font-medium">
                            August 15, 2022
                        </td>
                        <td className="flex text-sm px-6 py-2 whitespace-nowrap font-medium">
                            0.26 ETH
                            <div className="text-xs text-gray-400 ml-1 my-auto">(incl. 30% APR)</div>
                        </td>
                    </tr>
                    <tr className="odd:bg-gray-800">
                        <td className="px-6 py-1 whitespace-nowrap text-sm font-medium text-spritzig">
                            Payment 3
                        </td>
                        <td className="text-sm px-6 py-2 whitespace-nowrap font-medium">
                            August 22, 2022
                        </td>
                        <td className="flex text-sm px-6 py-2 whitespace-nowrap font-medium">
                            0.26 ETH
                            <div className="text-xs text-gray-400 ml-1 my-auto">(incl. 30% APR)</div>
                        </td>
                    </tr>
                    <tr className="border-t border-gray-600">
                        <td/>
                        <td className="px-6 py-1 whitespace-nowrap text-sm font-medium text-spritzig">
                            Total Payment
                        </td>
                        <td className="text-sm px-6 py-2 whitespace-nowrap font-medium">
                            1.18 ETH
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
            </div>
        </div>
    </div>
  )
}

export default PaymentSchedule