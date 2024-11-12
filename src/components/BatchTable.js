import React, { Fragment } from 'react';
import { IoPersonRemove } from 'react-icons/io5';

export default function BatchTable({ data, setData }) {
    return (
        <Fragment>
            <div class="relative overflow-x-auto w-full">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Student Name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Year & Section
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Section
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Time In
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Time Out
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data &&
                            Array.isArray(data) &&
                            data.length > 0 &&
                            data.map((item, index) => (
                                <tr
                                    key={item.id}
                                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <th
                                        scope="row"
                                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                        {item.name}
                                    </th>
                                    <td class="px-6 py-4">
                                        {item.year} - {item.course}
                                    </td>
                                    <td class="px-6 py-4">
                                        {item.section_ids &&
                                            JSON.parse(item.section_ids)
                                                .map((section) => section.name)
                                                .join(' - ')}
                                    </td>
                                    <td class="px-6 py-4">{item.timeIn}</td>
                                    <td class="px-6 py-4">{item.timeOut}</td>
                                    <td class="px-6 py-4">
                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                                            onClick={() => {
                                                setData(
                                                    data.filter(
                                                        (dataItem) =>
                                                            dataItem.id !==
                                                            item.id
                                                    )
                                                );
                                            }}
                                        >
                                            <IoPersonRemove />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
}
