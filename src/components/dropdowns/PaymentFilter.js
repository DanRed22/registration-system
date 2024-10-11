import React, { useCallback } from 'react';

export default function PaymentFilter({
    paymentFilter,
    setPaymentFilter,
    refresh,
}) {
    const handleClick = useCallback(
        (value) => {
            setPaymentFilter(value);
            refresh();
        },
        [refresh, setPaymentFilter]
    );
    return (
        <div className="absolute ml-44 border-black border mt-[-2rem] flex-col bg-white p-4 rounded-lg w-[35rem] space-x-4">
            <button
                className={`border border-black hover:bg-blue-200 p-2 rounded-lg duration-100 ${paymentFilter === 'PAID' ? 'bg-green-600 text-white' : ''}`}
                onClick={() => handleClick('PAID')}
            >
                Show Paid
            </button>
            <button
                className={`border border-black hover:bg-blue-200 p-2 rounded-lg duration-100 ${paymentFilter === 'UNPAID' ? 'bg-green-600 text-white' : ''}`}
                onClick={() => handleClick('UNPAID')}
            >
                Show Unpaid
            </button>
            <button
                className={`border border-black hover:bg-blue-200 p-2 rounded-lg duration-100 ${paymentFilter === 'ALL' ? 'bg-green-600 text-white' : ''}`}
                onClick={() => handleClick('ALL')}
            >
                Show All
            </button>
            <button
                onClick={() => handleClick('OFF')}
                className={`border border-black hover:bg-blue-200 p-2 rounded-lg duration-100 ${paymentFilter === 'OFF' ? 'bg-green-600 text-white' : ''}`}
            >
                Off
            </button>
            {paymentFilter !== 'PAID' &&
                paymentFilter !== 'UNPAID' &&
                paymentFilter !== 'ALL' &&
                paymentFilter !== 'OFF' && <p>No Filter Selected</p>}
        </div>
    );
}
