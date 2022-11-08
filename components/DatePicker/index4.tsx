import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import {
    DateRangePicker,
    DateRangeDelimiter,
    LocalizationProvider
} from "@material-ui/pickers";
import DateFnsUtils from "@material-ui/pickers/adapter/date-fns"; // choose your lib

type props = {
    id: any
}

export default function BasicDateRangePicker({ id }: props) {
    const [selectedDate, handleDateChange] = React.useState([null, null]);
    const [dataDate, setDataDate] = useState([])
    const bookedDates: any[] = []
    
    useEffect(() => {
        const getData = async () => {
            const data = await fetch('http://localhost:4000/api/dateBooked').then((res) => res.json())
            setDataDate(data)
        }
        getData()
    }, [])


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
    getBookedDates()

    const disableBookedDays = (date: any) => {
        const convertedIntoDateObject = bookedDates.map((bookedDate) => {
            return new Date(bookedDate).getTime();
        });
        //  return true
        return date.getTime() === 0 || date.getTime() === 6 || convertedIntoDateObject.includes(date.getTime());
    };   
    return (
        <LocalizationProvider dateAdapter={DateFnsUtils}>
            <DateRangePicker
                startText="Check-in"
                endText="Check-out"
                shouldDisableDate={disableBookedDays}
                value={selectedDate}
                disablePast
                onChange={(date: any) => handleDateChange(date)}
                renderInput={(startProps, endProps) => (
                    <>
                        <TextField {...startProps} />
                        <DateRangeDelimiter> to </DateRangeDelimiter>
                        <TextField {...endProps} />
                    </>
                )}
            />
        </LocalizationProvider>
    );
}
