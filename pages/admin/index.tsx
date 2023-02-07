import Head from 'next/head';
import { Box, Button, ButtonGroup, ClickAwayListener, Container, FormControl, Grid, Grow, InputLabel, MenuItem, MenuList, Paper, Popper, Select } from '@mui/material';
import { Budget } from '../../components/dashboard/budget';
import { TasksProgress } from '../../components/dashboard/tasks-progress';
import { TotalCustomers } from '../../components/dashboard/total-customers';
import { TotalProfit } from '../../components/dashboard/total-profit';
import { DashboardLayout } from '../../components/dashboard-layout';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend

} from 'chart.js';
import { useEffect, useRef, useState } from 'react';
import { isFirstDayOfMonth } from 'date-fns/fp';
import axios from 'axios';
import { log } from 'console';
import useSWR from 'swr';
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
)
function Page() {
  const [date, setDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [dataDashBoard, setDataDashBoard] = useState([])
  const [totalUser, setTotalUser] = useState([])
  const [revenueByMonth, setRevenueByMonth] = useState<any>([])
  const [mostRoomRevenue, setMostRoomRevenue] = useState<any>([])
  const [revenueByRoom, setRevenueByRoom] = useState<any>([])
  const [usersOftenCancels, setUsersOftenCancels] = useState<any>([])
  const [mostUserRevenues, setMostUserRevenues] = useState<any>([])
  const [type, setType] = useState("QUATER")
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [conditionMonth, setConditionMonth] = useState([]);
  const anchorRef = useRef<HTMLDivElement>(null);
  const time = new Date().getHours();
  const defaultCondition = {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    type: type
  }
  const [condition, setCondition] = useState(defaultCondition);
  const [conditionBottomBar, setConditionBottomBar] = useState({ month: new Date().getMonth() + 1 });
  function numberWithCommas(x: any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  useEffect(() => {
    if (time < 10) {
      setDate("Chào buổi sáng!")
      return;
    }
    if (time <= 12) {
      setDate("Chào buổi trưa!")
      return;
    }
    if (time <= 17) {
      setDate("Chào buổi chiều!")
      return;
    }
    else {
      setDate("Chào buổi tối!")
    }
  }, [time])

  useEffect(() => {
    load();
    const initMonth = () => {
      let arrMonth = [];
      for (let i = 0; i < new Date().getMonth()+1; i++) {
        arrMonth.push(i)
      }
      setConditionMonth(arrMonth);
    }
    initMonth();
  }, [condition, conditionBottomBar])

  const load = async () => {
    setLoading(true)
    const revenue = await axios.post("http://localhost:4000/api/revenue", condition);
    const user = await axios.get("http://localhost:4000/api/users");
    const revenueByMonth = await axios.post("http://localhost:4000/api/revenueByMonth");
    const revenueByRoom = await axios.post("http://localhost:4000/api/revenueByRoom", conditionBottomBar);
    const getRoomRevenue = await axios.post("http://localhost:4000/api/getRoomRevenue", conditionBottomBar);
    const getOftenCancels = await axios.post("http://localhost:4000/api/usersOftenCancel", conditionBottomBar);
    const getMostUserRevenues = await axios.post("http://localhost:4000/api/mostUserRevenues", conditionBottomBar);
    setRevenueByMonth(revenueByMonth.data);
    setRevenueByRoom(revenueByRoom.data);
    setDataDashBoard(revenue.data);
    setMostRoomRevenue(getRoomRevenue.data)
    setUsersOftenCancels(getOftenCancels.data)
    setMostUserRevenues(getMostUserRevenues.data)
    setTotalUser(user.data.length);
    setLoading(false)
  }
  
  let year = new Date().getFullYear();
  const data = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",],
    datasets: [
      {
        data: revenueByMonth[+year - 1]?.map((item: any) => item.total),
        label: year - 1,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
      },
      {
        label: year,
        data: revenueByMonth[year]?.map((item: any) => item.total),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
      }
    ]
  }
  const dataRevenueByRoom = {
    labels: revenueByRoom.map((item: any) => item.name),
    datasets: [
      {
        data: revenueByRoom.map((item: any) => item.total),
        label: 'Năm 2023',
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
      }
    ]
  }
  const dataMostRoomRevenue = {
    labels: mostRoomRevenue.map((item: any) => item.name),
    datasets: [
      {
        data: mostRoomRevenue.map((item: any) => item.total),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
      }
    ]
  }
  const datauUsersOftenCancel = {
    labels: usersOftenCancels.map((item: any) => item.name),
    datasets: [
      {
        data: usersOftenCancels.map((item: any) => item.total),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
      }
    ]
  }
  const dataMostUserRevenue = {
    labels: mostUserRevenues.map((item: any) => item.name),
    datasets: [
      {
        data: mostUserRevenues.map((item: any) => item.total),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
      }
    ]
  }
  const optionss = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      },
      title: {
        display: true,
        text: "Doanh thu theo tháng"
      }
    }
  };
  const options2 = {
    indexAxis: 'x' as const,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        display: false
      },
      title: {
        display: true,
        text: "Danh sách phòng có công suất sử dụng cao(tính theo tổng số giờ sử dụng)"
      }
    }
  };
  const optionsHighRevenue = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Danh sách phòng có doanh thu cao"
      }
    }
  };
  const optionsMostRoomRevenue = {
    indexAxis: 'x' as const,
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Danh sách phòng có doanh thu cao"
      }
    }
  };
  const optionsUserHighRevenue = {
    indexAxis: 'x' as const,
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Danh sách khách hàng thân thiết"
      }
    }
  };
  const usersOftenCancel = {
    indexAxis: 'x' as const,
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Danh sách khách hàng thường hủy phòng"
      }
    }
  };
  const options = ['Tháng', 'Quý', 'Năm'];

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    let _defaultCondition = { ...defaultCondition };
    if (index == 0) {
      _defaultCondition.type = "MONTH"
    }
    if (index == 1) {
      _defaultCondition.type = "QUATER";
    }
    if (index == 2) {
      _defaultCondition.type = "YEAR";
    }
    setCondition(_defaultCondition)
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      {loading ? <LinearProgress className='fixed top-[65px] z-50 w-full' /> : <></>}
      <div className='px-2'>
        <Head>
          <title>
            Dashboard
          </title>
        </Head>
        <div className="m-4 p-2 bg-white rounded-xl shadow-xl">
          <h1 className='text-3xl font-bold'>{date}</h1>
          <p className='text-normal'>Chào mừng bạn đến với trang tổng quan.</p>
        </div>
        <div className="m-4 p-4 bg-white rounded-xl shadow-xl grid xl:grid-cols-4 gap-4 sm:grid-cols-1">
          <div className="relative group cursor-pointer flex items-center justify-center flex-col rounded-xl shadow-xl p-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <p className='backdrop-blur-xl p-4 bg-white/30 rounded-full'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </p>
            <p className='text-2xl'>{numberWithCommas(dataDashBoard.reduce((pre, cur: any) => {
              return pre + cur.total || 0
            }, 0))} VND</p>
            <span>Doanh thu {options[selectedIndex]}</span>

            <div className="absolute p-2 cursor-pointer w-full flex justify-center text-black invisible translate-y-[50px] opacity-0 duration-300 group-hover:visible group-hover:opacity-100 group-hover:translate-y-[0px]">
              <ButtonGroup variant="outlined" className='bg-white' ref={anchorRef} aria-label="split button">
                <Button onClick={handleToggle}>{options[selectedIndex]}</Button>
                <Button
                  size="small"
                  aria-controls={open ? 'split-button-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-label="select merge strategy"
                  aria-haspopup="menu"
                  onClick={handleToggle}
                >
                  <ArrowDropDownIcon />
                </Button>
              </ButtonGroup>
              <Popper
                sx={{
                  zIndex: 1,
                }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id="split-button-menu" autoFocusItem>
                          {options.map((option, index) => (
                            <MenuItem
                              key={option}
                              selected={index === selectedIndex}
                              onClick={(event) => handleMenuItemClick(event, index)}
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          </div>
          <div className="flex items-center justify-center flex-col rounded-xl shadow-xl p-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white">
            <p className='backdrop-blur-xl p-4 bg-white/30 rounded-full'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5" />
              </svg>

            </p>
            <p className='text-2xl'>{numberWithCommas(dataDashBoard.reduce((pre, cur: any) => {
              return pre + cur.total
            }, 0))}</p>
            <span>Phòng đang được sử dụng</span>

          </div>
          <div className="flex items-center justify-center flex-col rounded-xl shadow-xl p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <p className='backdrop-blur-xl p-4 bg-white/30 rounded-full'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
              </svg>

            </p>
            <p className='text-2xl'>{numberWithCommas(dataDashBoard.reduce((pre, cur: any) => {
              return pre + cur.total
            }, 0))}</p>
            <span>Phòng trống</span>

          </div>
          <div className="flex items-center justify-center flex-col rounded-xl shadow-xl p-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white">
            <p className='backdrop-blur-xl p-4 bg-white/30 rounded-full'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>

            </p>
            <p className='text-2xl'>{numberWithCommas(totalUser)}</p>
            <span>Tổng người dùng</span>

          </div>
        </div>
        <div className='m-4 p-2 bg-white rounded-xl shadow-xl'>
          <Bar data={data} options={optionss} className='w-[100%]' />
        </div>
        <div className="relative p-4 bg-[#ddd] rounded-xl shadow-xl">
          <FormControl fullWidth className='bg-white rounded-md'>
            <InputLabel variant='standard' id="demo-simple-select-label"></InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={conditionBottomBar.month}
              label="Age"
              onChange={(e) => {
                let _conditionBottomBar = { ...conditionBottomBar };
                _conditionBottomBar.month = e.target.value.toString();
                setConditionBottomBar(_conditionBottomBar);
              }}
            >
              {conditionMonth.map((item: any, index: any) => {
                return <MenuItem key={index} value={item + 1}>Tháng {item + 1}</MenuItem>
              })}
              {/* <MenuItem value={1}>Tháng 1</MenuItem>
              <MenuItem disabled={conditionBottomBar.month > 2} value={2}>Tháng 2</MenuItem>
              <MenuItem disabled={conditionBottomBar.month > 3} value={3}>Tháng 3</MenuItem>
              <MenuItem disabled={conditionBottomBar.month > 4} value={4}>Tháng 4</MenuItem>
              <MenuItem disabled={conditionBottomBar.month > 5} value={5}>Tháng 5</MenuItem>
              <MenuItem disabled={conditionBottomBar.month > 6} value={6}>Tháng 6</MenuItem>
              <MenuItem disabled={conditionBottomBar.month > 7} value={7}>Tháng 7</MenuItem>
              <MenuItem disabled={conditionBottomBar.month > 8} value={8}>Tháng 8</MenuItem>
              <MenuItem disabled={conditionBottomBar.month > 9} value={9}>Tháng 9</MenuItem>
              <MenuItem disabled={conditionBottomBar.month > 10} value={10}>Tháng 10</MenuItem>
              <MenuItem disabled={conditionBottomBar.month > 11} value={11}>Tháng 11</MenuItem>
              <MenuItem disabled={conditionBottomBar.month > 12} value={12}>Tháng 12</MenuItem> */}
            </Select>
          </FormControl>
          <div className="flex flex-col sm:flex-row">
            <div className='m-2 bg-white rounded-xl shadow-xl basis-1/2'>
              <Bar data={dataRevenueByRoom} options={options2} className='w-[100%]' />
            </div>
            <div className='m-2 bg-white rounded-xl shadow-xl basis-1/2'>
              <Bar data={dataMostRoomRevenue} options={optionsMostRoomRevenue} className='w-[100%]' />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row">
            <div className='m-2 bg-white rounded-xl shadow-xl basis-1/2'>
              <Bar data={dataMostUserRevenue} options={optionsUserHighRevenue} className='w-[100%]' />
            </div>
            <div className='m-2 bg-white rounded-xl shadow-xl basis-1/2'>
              <Bar data={datauUsersOftenCancel} options={usersOftenCancel} className='w-[100%]' />
            </div>
          </div>
        </div>
      </div>
    </>
  )

};

Page.Layout = DashboardLayout

export default Page;
