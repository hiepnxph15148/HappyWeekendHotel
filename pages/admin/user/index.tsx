import Link from 'next/link'
import React from 'react'
import { DashboardLayout } from '../../../components/dashboard-layout'
import layoutAdmin from '../../../components/Layout/layoutAdmin'
import userUser from '../../../hook/use-user'
import { Button, TablePagination, Tooltip } from '@mui/material'
import ShowForPermission from '../../../components/Private/showForPermission'

type Props = {}

const UserAdmin = (props: Props) => {
    const { data, error, dele } = userUser()
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    if (!data) return <div>Loading...</div>
    if (error) return <div>Error</div>

    const remove = (item: any) => {
        const confirm = window.confirm(`Ban co muon xoa: ${item.name}`)
        if (confirm) {
            dele(`${item._id}`)
        }
    }
    return (
        <div>
            <div className="container w-[100%] p-2">
                <div className="container w-[100%] p-2">
                    <div className="flex flex-row mb-1 sm:mb-0 justify-between min-w-full ">
                        <h2 className="text-2xl leading-tight">
                            Users
                        </h2>
                    </div>
                    <div className="inline-block sm:min-w-full w-[900px] shadow-xl rounded-xl h-[600px] relative border">
                        <div className="h-full  pb-[50px]">
                            <table className="table-auto w-full border">
                                <thead className='sticky top-0 shadow z-50'>
                                    <tr>
                                        <th scope="col" className="text-xs px-5 py-3 bg-white border-b border-gray-200 text-[#333] text-left uppercase">

                                        </th>
                                        <th scope="col" className="text-xs px-5 py-3 bg-white border-b border-gray-200 text-[#333] text-left uppercase">
                                            Name
                                        </th>
                                        <th scope="col" className="text-xs px-5 py-3 bg-white border-b border-gray-200 text-[#333] text-left uppercase">
                                            Email
                                        </th>
                                        <th scope="col" className="text-xs px-5 py-3 bg-white border-b border-gray-200 text-[#333] text-left uppercase">
                                            status
                                        </th>
                                        <ShowForPermission>
                                            <th scope="col" className="text-xs px-5 py-3 bg-white border-b border-gray-200 text-[#333] text-left uppercase">
                                            </th>
                                        </ShowForPermission>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: any, index: any) => (
                                        <tr key={item._id} className="cursor-pointer select-none">
                                            <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    {index + 1}
                                                </p>
                                            </td>
                                            <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        <a href="#" className="block relative">
                                                            <img alt="profil" src={item.avatar} className="mx-auto object-cover rounded-full h-10 w-10 " />
                                                        </a>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-gray-900 whitespace-no-wrap">
                                                            {item.name}
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
                                                <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                    <span aria-hidden="true" className="absolute inset-0 bg-green-200 opacity-50 rounded-full">
                                                    </span>
                                                    <span className="relative">
                                                        active
                                                    </span>
                                                </span>
                                            </td>
                                            <ShowForPermission>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                   
                                                    <button className=' bg-red-600 text-white rounded hover:bg-red-800 mb-4 px-3 py-2  ' onClick={() => remove(item._id)} >Xóa</button> <br />
                                                </td>
                                            </ShowForPermission>
                                        </tr>
                                    ))}
                                </tbody>
                              
                            </table>
                           
                        </div>
                        <div className="absolute bottom-0 bg-white w-full border-t border">
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
                </div>
            </div>
        </div>
    )
}


UserAdmin.Layout = DashboardLayout
export default UserAdmin





