/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import { CardActionArea } from '@mui/material';
import Link from 'next/link';

type props = {
  newsList: any
}

export default function ActionAreaCard({ newsList }: props) {
  return (
    <div className={`flex mb:justify-between flex-wrap mbs:justify-center`}>
      {newsList?.length == 0 ? <div className='flex h-[100vh] w-full items-center '>Không có phòng nào thỏa mãn yêu cầu</div> : newsList?.map((item: any, index: any) => {
        return (
          <div className={`mb-4 ${item.status ? '' : 'hidden'}`} key={index}>
            <Link href={`/booking_detail/${item.slug}`}>
              <CardActionArea sx={{ display: "flex", flexDirection: "column", alignContent: "space-between", justifyContent: "space-between" }}>
                <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                  <div className='h-[200px] overflow-hidden'>
                    <img className="rounded-t-lg " src={item.image ? item.image[0] : ''} alt="" />
                    
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start h-[60px]">
                      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{item.name}</h5>
                      {/* <p className='text-[green] font-semibold basis-1/4 flex justify-end'>{item.price ? `${item.price} VND` : ""}</p> */}
                    </div>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
                    <a href="#" className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      Read more
                      <svg aria-hidden="true" className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </a>
                  </div>
                </div>
              </CardActionArea>
            </Link>
          </div>
          
        )
      })}
    </div>
    
  );
}

{/* <div className="overflow-hidden w-[345px] h-[200px]">
                  <img src={item.src || item.image} className="w-full h-full" alt="" />
                </div>
                <div className='p-2 flex justify-between items-center w-full'>
                  <div>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <p dangerouslySetInnerHTML={{ __html: item.description || "desc" }}></p>
                    </Typography>
                  </div>
                  <div>
                    <p className='text-[green] text-md font-semibold'>{item?.price ? `${item.price} VND` : ""} </p>
                  </div>
                </div> */}
