import React, { useEffect, useMemo, useState } from "react";
import TextField from "@material-ui/core/TextField";
import {
    DateRangePicker,
    DateRangeDelimiter,
    LocalizationProvider
} from "@material-ui/pickers";
import DateFnsUtils from "@material-ui/pickers/adapter/date-fns"; // choose your lib
import dayjs from "dayjs";
import { API_URL } from "../../constants";

type props = {
    id: string;
    getDate: any;
    settotaldate: any;
    disabled: any
}

export default function BasicDateRangePicker({ id, getDate, settotaldate, disabled }: props) {
    const defaultSelectedDate = useMemo(() => {
        const currentDate = new Date();
        const futureDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

        return [dayjs(currentDate.toISOString()), dayjs(futureDate.toISOString())];
    }, []);

    const [selectedDate, setSelectedDate] = useState<any>(defaultSelectedDate);
    const [dataDate, setDataDate] = useState([]);
    const bookedDates: any[] = [];

    const dateone: any = new Date(selectedDate?.[0])
    const datetwo: any = new Date(selectedDate?.[1])
    const time = Math.abs(datetwo - dateone)
    const days = Math.ceil(time / (1000 * 60 * 60 * 24))
    settotaldate(days);

    useEffect(() => {
        const getData = async () => {
            const data = await fetch(`${API_URL}/dateBooked`).then((res) => res.json())
            setDataDate(data)
        }
        getData()
    }, [])
    getDate(selectedDate)

    const getBookedDates = () => {
        dataDate?.forEach((item: any) => {
            if (item.room == id) {
                const startDate = new Date(item.dateFrom).getTime()
                const endDate = new Date(item.dateTo).getTime()
                const rangeDate = ((((endDate - startDate) / 1000) / 60) / 60) / 24
                let rangeDateValue = startDate;
                for (let i = 0; i < rangeDate; i++) {
                    bookedDates.push(rangeDateValue += 86400000)
                }
                bookedDates.push(startDate, endDate)
            }
            else return bookedDates
        })
    }
    getBookedDates();

    const disableBookedDays = (date: any) => {
        const convertedIntoDateObject = bookedDates.map((bookedDate) => {
            return new Date(bookedDate).getTime();
        });
        //  return true
        return date.getTime() === 0 || date.getTime() === 6 || convertedIntoDateObject.includes(date.getTime());
    };

    return (
        <LocalizationProvider
            dateAdapter={DateFnsUtils as any}
        >
            <DateRangePicker
                startText="Nhận phòng"
                endText="Trả phòng"
                inputFormat="dd/MM/YYY"
                shouldDisableDate={disableBookedDays}
                value={selectedDate}
                disablePast

                onChange={(date: any) => setSelectedDate(date)}
                renderInput={(startProps, endProps) => (
                    <>
                        <TextField {...startProps} />
                        <DateRangeDelimiter> to </DateRangeDelimiter>
                        <TextField disabled {...endProps} />
                        {/* <input value={...endProps} /> */}
                    </>
                )}
            />
        </LocalizationProvider>
    );
}
