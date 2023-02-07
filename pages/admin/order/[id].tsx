/* eslint-disable @next/next/no-img-element  */
import axios from "axios";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { sendMail, update } from "../../../api/order";
import React, { useEffect, useState } from "react";
import { sendMailVoucher, update as updateVoucher } from "../../../api/voucher";
import { remove } from "../../../api/bookedDate";
import { getOnefac } from "../../../api/facilities";
import { DashboardLayout } from "../../../components/dashboard-layout";
import { API_URL } from "../../../constants";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import dayjs from "dayjs";
type Props = {};
type Form = {
  statusorder: number;
};
const DetailOrder = (props: Props) => {
  const [order, setorder] = useState<any>();
  const [facilities, setfacilities] = useState<any>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>();
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    const get = async () => {
      const { data } = await axios.get(`${API_URL}/order/${id}`);
      setorder(data);
      console.log(data);
    };
    get();
  }, [id]);

  useEffect(() => {
    const get = async () => {
      await getOnefac(order?.room[0]._id).then((res: any) => {
        setfacilities(res);
        console.log(facilities);
      });
    };
    get();
  }, [order?.room[0]._id]);

  const statuss = (value: number) => {
    if (value == 0) {
      return (
        <span className="rounded-full py-[5px] px-[10px] bg-sky-400 text-center text-white font-medium">
          Chờ Xác Nhận
        </span>
      );
    } else if (value == 1) {
      return (
        <span className="rounded-full py-[5px] px-[10px] bg-orange-600 text-center text-white font-medium">
          Đã Xác Nhận
        </span>
      );
    } else if (value == 2) {
      return (
        <span className="rounded-full py-[5px] px-[10px] bg-green-500 text-center text-white font-medium">
          Đang Có Khác Ở
        </span>
      );
    } else if (value == 3) {
      return (
        <span className="rounded-full py-[5px] px-[10px] bg-sky-500 text-center text-white font-medium">
          Đã Trả Phòng
        </span>
      );
    } else {
      return (
        <span className="rounded-full py-[5px] px-[10px] bg-red-500 text-center text-white font-medium">Hủy Phòng</span>
      );
    }
  };
  const updateStatus = (status: any) => {
    if (status?.statusorder == 0) {
      return (
        <select
          id=""
          {...register("statusorder")}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="1">Đã Xác nhận</option>
          <option value="2">Đang có khách</option>
          <option value="4">Hủy</option>
        </select>
      );
    } else if (status?.statusorder == 1) {
      return (
        <select
          id=""
          {...register("statusorder")}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="2">Đang có khách</option>
          <option value="3">Đã trả phòng</option>
          <option value="4">Hủy</option>
        </select>
      );
    } else if (status?.statusorder == 2) {
      return (
        <select
          id=""
          {...register("statusorder")}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="3">Đã trả phòng</option>
          {/* <option value="4">Hủy</option> */}
        </select>
      );
    } else if (status?.statusorder == 3) {
      return "Đã trả phòng";
    }
  };

  const onsubmit: SubmitHandler<Form> = async (data) => {
    const newdata: any = {
      ...data,
      _id: id,
      name: order?.order.name,
      email: order?.order.email,
      phone: order?.order.phone,
      total: order?.order.total,
      checkins: order?.order.ckeckins,
      checkouts: order?.order.ckeckins,
      room: order?.room[0]._id,
      user: order?.order.user,
    }
    // tăng số lượng voucher khi hủy phòng.
    if (data.statusorder == 4 && order.order.voucher) {
      await updateVoucher({
        ...order.order.voucher,
        quantity: order.order.voucher.quantity + 1,
      });
    }

    // gửi mail ds voucher cho user nếu cập nhật trạng thái đã trả phòng.
    if (data.statusorder == 3 && order?.order.user) {
      await sendMailVoucher({ user: order?.order.user });
    }

    await update(newdata).then((res: any) => {
      if (res?.statusorder == 4 || res?.statusorder == 3) {
        remove(res?.status).then(() => {
          router.push("/admin/order");
        });
      } else if (res.statusorder == 1) {
        const datamail: any = {
          name: order?.order.name,
          email: order?.order.email,
          phone: order?.order.phone,
          total: order?.order.total,
          checkins: order?.order.checkins,
          checkouts: order?.order.checkouts,
          room: order?.room[0].name,
          user: order?.order.user,
        };
        sendMail(datamail);
        console.log(sendMail);
      } else {
        router.push("/admin/order");
      }
    });
  };
  // format tiền.
  const formatCurrency = (currency: number) => {
    const tempCurrency = +currency >= 0 ? currency : 0;
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "VND" }).format(tempCurrency);
  };


  const methodPay = (key: string) => {
    if (key == "0") {
      return <div className="pb-[20px]">
        <span className="font-medium">Phương thức:</span>
        <span className="float-right">
          Thanh toán trực tiếp
        </span>

      </div>
    } else if (key == "1") {
      return <div className="pb-[20px]">
        <span className="font-medium">Phương thức:</span>
         <span className="float-right">Thanh toán trực tuyến</span>. <br /> 
         <span className="float-right text-red-500">Chưa thanh toán</span>
      </div>
    } else if (key == "2") {
      return <div className="pb-[20px]">
        <span className="font-medium">Phương thức:</span>
         <span className="float-right">Thanh toán trực tuyến</span>. <br /> 
         <span className="float-right">Đã thanh toán</span>
      </div>
    }
  }
  return (
    <div>
      <div className="flex">
        <div className="w-3/5 p-[30px]">
          <h1 className="text-[30px] text-center font-bold">Thông tin phòng</h1>
          <div className="px-[100px] py-[40px]">
            <div>
              <h1 className="text-[25px] font-medium">{order?.room[0].name}</h1>
            </div>
            <div className="py-[20px] flex grid grid-cols-2 gap-4">
              {order?.room[0].image?.map((item: any, index: number) => (
                <img width={400} src={`${item}`} alt="" key={index} />
              ))}
            </div>
            <div className="flex">
              <div>
                <span className="text-[18px] font-medium">Thời gian CheckIn</span> :
                <div className="ml-[20px] mt-[20px]">
                  <span>Giờ:</span> {dayjs(order?.order.checkins).format("HH:mm")} <br />
                  <span>Ngày:</span> {dayjs(order?.order.checkins).format("DD/MM/YYYY")}
                </div>
              </div>
              <div className="ml-[30px]">
                <span className="text-[18px] font-medium">Thời gian CheckOut :</span>
                <div className="ml-[20px] mt-[20px]">
                  <span>Giờ:</span> {dayjs(order?.order.checkouts).format("HH:mm")} <br />
                  <span>Ngày:</span> {dayjs(order?.order.checkouts).format("DD/MM/YYYY")}
                </div>
              </div>
              {/* <div className="ml-[30px]">
                <h1 className="text-[18px] font-medium">Tiện ích</h1>
                <div className="grid grid-cols-2 gap-4 mt-[10px]">
                  {facilities?.map((item: any, index: number) => (
                    <div className="flex" key={index}>
                      <img width={30} src={item.image} alt="" />
                      <p className=" ml-[5px] self-center">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div className=" w-[1px] h-[500px] bg-orange-700 mt-[30px]"></div>
        <div className="w-2/5 p-[30px]">
          <h1 className="text-[30px] font-bold text-center">Thông tin khách hàng</h1>
          <div className="py-[50px] px-[30px] w-[350px]">
            <div className="pb-[20px]">
              <span className="font-medium">Name:</span>
              <span className="float-right"> {order?.order.name}</span>
            </div>
            <div className="pb-[20px]">
              <span className="font-medium">Phone:</span>
              <span className="float-right"> 0{order?.order.phone}</span>
            </div>
            <div className="pb-[20px]">
              <span className="font-medium">Email:</span>
              <span className="float-right"> {order?.order.email}</span>
            </div>
            <div className="pb-[20px]">
              <span className="font-medium">Tạm tính:</span>
              <span className="float-right">{formatCurrency(order?.order.total)}</span>
            </div>
            {order?.order.voucher && (
              <div className="pb-[20px]">
                <span className="font-medium">Voucher:</span>
                <span className="float-right">
                  {order?.order.voucher.code} (-{formatCurrency(order?.order.voucher?.discount)})
                </span>
              </div>
            )}
            <div className="pb-[20px]">
              <span className="font-medium text-[20px] text-orange-600">Tổng tiền:</span>
              <span className="float-right font-medium text-[18px] font-sans text-orange-600">
                {formatCurrency(order?.order.total - (order?.order.voucher?.discount || 0))}
              </span>
            </div>
            <div>
              
              <div className="py-[10px]">
                <label className="font-medium">Status Booking: </label>
                <span className="float-right">{statuss(order?.order.statusorder)}</span>
              </div>
              <div>
                {methodPay(order?.order.methodpay)}
              </div>

              <form action="" className="flex mt-[30px]" onSubmit={handleSubmit(onsubmit)}>
                <div className="">{updateStatus(order?.order)} </div>
                <button onClick={()=>{
                  router.push('/admin/order').then(()=>{
                    toastr.success('Cập nhật thành công')
                  })
                  
                }} className="ml-[20px] inline-flex justify-center rounded-md border border-transparent bg-sky-400 py-[10px] px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Cập Nhật
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
DetailOrder.Layout = DashboardLayout;

export default DetailOrder;
