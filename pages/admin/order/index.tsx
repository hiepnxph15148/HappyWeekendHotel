import Link from 'next/link'
import React from 'react'
import { DashboardLayout } from '../../../components/dashboard-layout'
import OrderHook from '../../../hook/use-order'
import { OrderType } from '../../../types/order'
import { Button, TablePagination, Tooltip } from '@mui/material'
import dayjs from 'dayjs'
type Props = {}

const index = (props: Props) => {
    const { data, error, mutate } = OrderHook()
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(8);

    if (!data) return <div>Loading...</div>
    if (error) return <div>Errors</div>
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const statuss = (value: number) => {
        if (value == 0) {
            return <span className='rounded-full py-[5px] px-[10px] bg-sky-500 text-center text-white font-medium'>Chờ Xác Nhận</span>
        } else if (value == 1) {
            return <span className='bg-orange-600 rounded-full py-[5px] px-[10px] bg-sky-500 text-center text-white font-medium'>Đã Xác Nhận</span>
        } else if (value == 2) {
            return <span className='bg-green-600 rounded-full py-[5px] px-[10px] bg-sky-500 text-center text-white font-medium'>Đang Có Khách</span>
        } else if (value == 3) {
            return <span className='bg-sky-600 rounded-full py-[5px] px-[10px] bg-sky-500 text-center text-white font-medium'>Đã Trả Phòng</span>
        }
        else {
            return <span className='bg-red-600 rounded-full py-[5px] px-[10px] bg-sky-500 text-center text-white font-medium'>Hủy Phòng</span>
        }
    }

    return (
        <div>
            <table className="min-w-full leading-normal scroll">
                <thead>
                    <tr>
                        <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">

                        </th>
                        <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                            Tên Khách Hàng
                        </th>
                        <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                            Phòng
                        </th>
                        <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                            Email
                        </th>
                        <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                            Số điện thoại
                        </th>
                        <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                            Check in
                        </th>
                        <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                            Trạng thái Phòng
                        </th>
                        <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: any, index: number) => (
                        <tr key={index}>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                    {index + 1}
                                </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <div className="flex items-center">
                                    <div className="ml-3">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {item.name}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <div className="flex items-center">
                                    <div className="ml-3">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {item.room?.name}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                    {item.email}
                                </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                    {item.phone}
                                </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                    {dayjs(item.checkins).format("HH:mm DD/MM/YYYY")}
                                </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                    <div className=''>
                                        {statuss(item.statusorder)}
                                    </div>
                                </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <Link href={`/admin/order/${item._id}`}><button className='bg-gray-600 rounded-full py-[5px] px-[10px] bg-sky-500 text-center text-white font-medium'>Detail</button></Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className=" bottom-0 bg-white w-full border-t border">
                <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </div>
    )
}
index.Layout = DashboardLayout

export default index