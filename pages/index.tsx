import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import SimpleSwiper from "../components/Slide";
import ActionAreaCard from "../components/Card";
import useProducts from "../hook/use-product";
import Link from "next/link";
import TextField from "@material-ui/core/TextField";
import { DateRangePicker, DateRangeDelimiter, LocalizationProvider, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@material-ui/pickers/adapter/date-fns"; // choose your lib
import { InputAdornment, Skeleton } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import SiteLayout from "../components/Layout";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useRouter } from "next/router";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const Home = () => {
  const router = useRouter();

  const defaultSelectedDate = useMemo(() => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

    return [dayjs(currentDate.toISOString()), dayjs(futureDate.toISOString())];
  }, []);

  const [selectedDate, setSelectedDate] = useState<any>(defaultSelectedDate);
  const [visible, setVisible] = useState(true);

  // thời gian nhận phòng - form tìm kiếm theo giờ
  const [dateTimeStart, setDateTimeStart] = useState<Dayjs | null>(() => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 6, 30);

    return dayjs(futureDate.toISOString());
  });

  // thời gian trả phòng - form tìm kiếm theo giờ
  const [hours, setHours] = useState<number>(2);

  const room = useProducts("");
  const [indexTab, setIndexTab] = useState(1);

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);
  }, []);

  const skeletonLoadingRoom = () => {
    return (
      <div className="flex justify-between">
        <div className="">
          <Skeleton variant="rounded" width={350} height={100} />
          <Skeleton variant="text" width={350} height={30} />
          <Skeleton variant="text" width={350} height={30} />
          <Skeleton variant="text" width={350} height={30} />
        </div>
        <div className="">
          <Skeleton variant="rounded" width={350} height={100} />
          <Skeleton variant="text" width={350} height={30} />
          <Skeleton variant="text" width={350} height={30} />
          <Skeleton variant="text" width={350} height={30} />
        </div>
        <div className="">
          <Skeleton variant="rounded" width={350} height={100} />
          <Skeleton variant="text" width={350} height={30} />
          <Skeleton variant="text" width={350} height={30} />
          <Skeleton variant="text" width={350} height={30} />
        </div>
      </div>
    );
  };

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 150) {
      setVisible(false);
    } else if (scrolled <= 150) {
      setVisible(true);
    }
  };

  // search room.
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDate[0] || !selectedDate[1]) {
      toastr.info("Vui lòng chọn thời gian trả phòng!");
      return;
    }

    let query = {};

    // tìm kiếm theo giờ.
    if (indexTab === 1) {
      const timeCheckin = new Date(dateTimeStart as any);

      query = {
        checkin: new Date(
          timeCheckin.getFullYear(),
          timeCheckin.getMonth(),
          timeCheckin.getDate(),
          timeCheckin.getHours(),
          timeCheckin.getMinutes(),
          timeCheckin.getSeconds(),
        ).toISOString(),
        checkout: new Date(
          timeCheckin.getFullYear(),
          timeCheckin.getMonth(),
          timeCheckin.getDate(),
          timeCheckin.getHours() + hours,
          timeCheckin.getMinutes(),
          timeCheckin.getSeconds(),
        ).toISOString(),
      };
    } else {
      const [checkin, checkout] = selectedDate;
      const dateCheckin = new Date(checkin);
      const dateCheckout = new Date(checkout);

      // tìm kiếm phòng qua đêm, theo ngày mặc định thời gian checkin là 14h và checkout là 12h trưa hôm sau.
      query = {
        checkin: new Date(dateCheckin.getFullYear(), dateCheckin.getMonth(), dateCheckin.getDate(), 14).toISOString(),
        checkout: new Date(
          dateCheckout.getFullYear(),
          dateCheckout.getMonth(),
          dateCheckout.getDate(),
          12,
        ).toISOString(),
      };
    }

    router.push({
      pathname: "search",
      query,
    });
  };

  const DateRangerPicker = () => {
    return (
      <LocalizationProvider dateAdapter={DateFnsUtils as any}>
        <DateRangePicker
          startText="Nhận phòng"
          inputFormat="dd/MM/YYY"
          endText="Trả phòng"
          value={selectedDate}
          disablePast
          onChange={(date: any) => setSelectedDate(date)}
          renderInput={(startProps, endProps) => (
            <>
              <TextField
                {...startProps}
                size="small"
                variant="standard"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LoginIcon />
                    </InputAdornment>
                  ),
                }}
                helperText=""
              />
              <DateRangeDelimiter> to </DateRangeDelimiter>
              <TextField
                {...endProps}
                size="small"
                variant="standard"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LogoutIcon />
                    </InputAdornment>
                  ),
                }}
                error={!selectedDate[1]}
                helperText=""
              />
            </>
          )}
        />
      </LocalizationProvider>
    );
  };

  const DateTimePickers = () => {
    return (
      <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            disablePast
            label="Nhận phòng"
            inputFormat="HH:mm, DD [tháng] MM"
            renderInput={(params) => <TextField {...params} size="small" helperText="" />}
            value={dateTimeStart}
            onChange={(newValue) => {
              setDateTimeStart(newValue);
            }}
          />
        </LocalizationProvider>

        <div className="ml-2 mr-3 min-w-[150px]">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Số giờ sử dụng</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={hours as any}
              label="Age"
              onChange={(e: ChangeEvent<any>) => {
                setHours(+e.target.value);
              }}
            >
              <MenuItem value={1}>1 giờ</MenuItem>
              <MenuItem value={2}>2 giờ</MenuItem>
              <MenuItem value={3}>3 giờ</MenuItem>
              <MenuItem value={4}>4 giờ</MenuItem>
              <MenuItem value={5}>5 giờ</MenuItem>
              <MenuItem value={6}>6 giờ</MenuItem>
              <MenuItem value={7}>7 giờ</MenuItem>
              <MenuItem value={8}>8 giờ</MenuItem>
              <MenuItem value={9}>9 giờ</MenuItem>
              <MenuItem value={10}>10 giờ</MenuItem>
            </Select>
          </FormControl>
        </div>
      </>
    );
  };

  return (
    <div className="">
      <div className="w-[80%] mx-auto relative mb-[50px] z-10">
        <div className="flex justify-center h-[286px] bg-[url('https://res.cloudinary.com/dkhutgvlb/image/upload/v1669818180/33_1654843382_62a2e7f6b03fb_brxw7x.png')] bg-no-repeat bg-cover">
          <h1 className="text-5xl text-center font-semibold text-white mt-5 w-[65%]">
            Đặt phòng nhà nghỉ nhanh - tiện lợi
          </h1>
        </div>

        {/* search */}
        <form
          onSubmit={handleSearch}
          className={`${
            visible ? "visible scale-100 opacity-100" : "invisible scale-50 opacity-0"
          } duration-300 translate-x-[-50%] translate-y-[-80%] absolute top-[100%] left-[50%] w-[80%] mx-auto bg-white shadow-xl rounded-xl p-4`}
        >
          <div className="flex justify-center">
            <button
              type="button"
              className={`${
                indexTab == 1 ? "text-[red] border-b border-[red]" : "border-b border-[white]"
              } duration-150 hover:text-[red] flex flex-col items-center px-4`}
              onClick={() => {
                setIndexTab(1);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Theo giờ</p>
            </button>

            <button
              type="button"
              className={`${
                indexTab == 2 ? "text-[red] border-b border-[red]" : null
              } duration-150 hover:text-[red] flex flex-col items-center px-4`}
              onClick={() => {
                setIndexTab(2);
                setSelectedDate(defaultSelectedDate);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
              <p>Qua đêm</p>
            </button>

            <button
              type="button"
              className={`${
                indexTab == 3 ? "text-[red] border-b border-[red]" : null
              } duration-150 hover:text-[red] flex flex-col items-center px-4`}
              onClick={() => {
                setIndexTab(3);
                setSelectedDate(defaultSelectedDate);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                />
              </svg>
              <p>Theo ngày</p>
            </button>
          </div>
          <div className={`border rounded-full p-4 mt-4 relative flex justify-center`}>
            {indexTab == 1 && <DateTimePickers />}
            {indexTab == 2 && <DateRangerPicker />}
            {indexTab == 3 && <DateRangerPicker />}

            <button className="flex px-4 py-2 bg-[orange] rounded-full text-white cursor-pointer items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <p>Tìm kiếm</p>
            </button>
          </div>
        </form>
      </div>
      <div className="mb:w-[80%] mbs:w-[95%] mx-auto pt-2">
        <h1 className='text-3xl font-semibold text-[orange] py-6'>Danh sách các phòng </h1>
        {room.data ? <SimpleSwiper newsList={room.data} /> : skeletonLoadingRoom()}
      </div>
        <div className="mb:w-[80%] mbs:w-[95%] mx-auto pt-2">
          <p className="text-2xl text-amber-400 py-6 font-bold">Trải nghiệm cùng HappyWeekendHotel</p>
      
          <div className="flex justify-between">
            <div>
        <a href="" className="absolute"><img className="w-[550px]" src="https://s3.go2joy.vn/1000w/hotel/171_1656566391_62bd327718636.jpg" alt="" /></a>
        <p className=" relative text-slate-100 text-3xl font-bold m-20 tracking-wide flex">Giá sốc 
        <svg className="text-slate-100" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 512 512"><title>ionicons-v5-m</title><path d="M315.27,33,96,304H224L192.49,477.23a2.36,2.36,0,0,0,2.33,2.77h0a2.36,2.36,0,0,0,1.89-.95L416,208H288L319.66,34.75A2.45,2.45,0,0,0,317.22,32h0A2.42,2.42,0,0,0,315.27,33Z" /></svg>
        Đêm Nay</p>
        <h1 className="text-normal font-semibold text-[orange] py-3 mx-auto group hover:opacity-50 duration-300 flex items-center cursor-pointer absolute ml-[80px] bg-slate-200 w-[100px] rounded-lg">
            <Link href="#">Xem thêm</Link>
              
               
            </h1>
        </div>
              <p className="mb:flex mbs:hidden">
              <a href="#"><img className="w-[550px]" src="https://s3.go2joy.vn/1000w/hotel/171_1656573947_62bd4ffb3b750.jpg" alt="" /></a>
              </p>
            
        </div> 
        </div>
      {/* list news */}
      <div className="py-8">
        <div className="w-[80%] mx-auto">
          <div className="flex justify-between items-center ">
            <h1 className="relative"><img className="rounded-lg" src="https://s3.go2joy.vn/1000w/cover_photo/33_14148447441.jpg" alt="" /></h1>
            <h1 className="absolute pb-20 ml-[40px] text-white text-3xl mb:pb-20 ml-[40px] mbs:pb-10 ml-[20px] font-bold mb:text-3xl mbs:text-xl">Những điều thú vị có thể bạn chưa biết</h1>
            <h1 className="text-normal font-semibold text-[orange] py-6 mx-auto group hover:opacity-50 duration-300 flex items-center cursor-pointer absolute ml-[40px] bg-slate-200 w-[200px] rounded-lg mbs: mb:mt-[60px] ml-[20px] w-[100px] py-2 h-[30px]">
            <Link href="/blog">Danh sách các bài blog</Link>
              
               
            </h1>
          </div>
          <ActionAreaCard
            newsList={[
              [
                {
                  _id: "63613e3ec5b015dc3665246c",
                  name: "ThanhntOk",
                  slug: "thanhntok",
                  image: {
                    _id: "63613e50c5b015dc3665246f",
                    image: [
                      "https://a0.muscache.com/im/pictures/beec3be2-ad2b-423b-a9a5-75070f905d0b.jpg?im_w=720",
                      "https://a0.muscache.com/im/pictures/235d56fe-4241-4267-a24c-c70fdb4f8711.jpg?im_w=1200",
                    ],
                    room: "63613e3ec5b015dc3665246c",
                    createdAt: "2022-11-01T15:42:08.949Z",
                    updatedAt: "2022-11-01T15:48:25.010Z",
                    __v: 0,
                  },
                  price: 150,
                  description: "<p>ABCLGVSBDKVBSDLVHOSBDVSBDIUSDIUCBSDHVSDIYFVDS</p>",
                  coc: true,
                  category: "6352172dcdb05980122fdcb0",
                  date: "635e9b7c5dee23ec01e8f4e6",
                  createdAt: "2022-11-01T15:41:50.511Z",
                  updatedAt: "2022-11-01T15:46:43.167Z",
                  __v: 0,
                },
              ],
            ]}
          />
        </div>
      </div>
    </div>
  );
};

Home.Layout = SiteLayout;
export default Home;
