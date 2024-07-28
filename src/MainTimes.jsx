import axios from 'axios';
import moment from 'moment/moment';
import { useState, useEffect } from 'react';
import  evening from './assets/icons/evening-prayer.gif';
import kaaba from './assets/icons/kaaba.gif';
import morning from './assets/icons/morning-prayer.gif';
import mosque from './assets/icons/mosque.gif';
import hizb from './assets/icons/rub-el-hizb.gif';
export default function MainTimes() {

    // Cities
    const cities = [
        { id: 1, name: "القاهرة", apiName: "cairo" },
        { id: 2, name: "الإسكندرية", apiName: "alexandria" },
        { id: 3, name: "الجيزة", apiName: "giza" },
        { id: 4, name: "الدقهلية", apiName: "dakahlia" },
        { id: 5, name: "أسوان", apiName: "aswan" },
        { id: 6, name: "أسيوط", apiName: "asyut" },
        { id: 7, name: "الأقصر", apiName: "luxor" },
        { id: 8, name: "البحر الأحمر", apiName: "red-sea" },
        { id: 9, name: "الفيوم", apiName: "fayoum" },
        { id: 10, name: "قنا", apiName: "qena" },
        { id: 11, name: "سوهاج", apiName: "sohag" },
        { id: 12, name: "بور سعيد", apiName: "port-said" },
        { id: 13, name: "بني سويف", apiName: "beni-suef" },
        { id: 14, name: "الإسماعيلية", apiName: "ismailia" },
        { id: 15, name: "دمياط", apiName: "damietta" },
        { id: 16, name: "مطروح", apiName: "matruh" },
        { id: 17, name: "جنوب سيناء", apiName: "south-sinai" },
        { id: 18, name: "شمال سيناء", apiName: "north-sinai" },
        { id: 19, name: "المنوفية", apiName: "monufia" },
        { id: 20, name: "المنيا", apiName: "minya" },
        { id: 21, name: "القليوبية", apiName: "qalyubia" },
        { id: 22, name: "كفر الشيخ", apiName: "kafr-el-sheikh" },
        { id: 23, name: "الغربية", apiName: "gharbia" },
        { id: 24, name: "دمياط", apiName: "damietta" },
    ]
    const cityList = cities.map((city) =>
        <option key={city.id} value={city.apiName}>{city.name}</option>
    );
    const [city, setCity] = useState({ id: 1, name: "القاهرة", apiName: "cairo" });

    const [date, setDate] = useState({});
    // const [dateNow, setDateNow] = useState({});

    const [timings, setTimings] = useState(
        { Fajr: "04:30", Dhuhr: "13:01", Asr: "16:39", Maghrib: "19:52", Isha: "21:20" }
    );


    const [nextPrayer, setNextPrayer] = useState("");
    const [remainTime, setRemainTime] = useState("");
    useEffect(() => {
        getTimings();
        NextPrayer();
    }, [city]);

    // Next Prayer
    const NextPrayer = () => {
        if (moment().isAfter(moment(timings["Fajr"], "HH:mm")) && moment().isBefore(moment(timings["Dhuhr"], "HH:mm"))) {
            const dif = moment.duration(moment(timings["Dhuhr"], "HH:mm").diff(moment(), "HH:mm"));
            let h = dif.hours();
            let m = dif.minutes();
            setRemainTime(h + " ساعة و " + m + " دقيقة");
            setNextPrayer("الظهر")

        } else if (moment().isAfter(moment(timings["Dhuhr"], "HH:mm")) && moment().isBefore(moment(timings["Asr"], "HH:mm"))) {
            const dif = moment.duration(moment(timings["Asr"], "HH:mm").diff(moment(), "HH:mm"));
            let h = dif.hours();
            let m = dif.minutes();
            setRemainTime(h + " ساعة و " + m + " دقيقة");
            setNextPrayer("العصر")

        } else if (moment().isAfter(moment(timings["Asr"], "HH:mm")) && moment().isBefore(moment(timings["Maghrib"], "HH:mm"))) {
            const dif = moment.duration(moment(timings["Maghrib"], "HH:mm").diff(moment(), "HH:mm"));
            let h = dif.hours();
            let m = dif.minutes();
            setRemainTime(h + " ساعة و " + m + " دقيقة");
            setNextPrayer("المغرب")

        } else if (moment().isAfter(moment(timings["Maghrib"], "HH:mm")) && moment().isBefore(moment(timings["Isha"], "HH:mm"))) {
            const dif = moment.duration(moment(timings["Isha"], "HH:mm").diff(moment(), "HH:mm"));
            let h = dif.hours();
            let m = dif.minutes();
            setRemainTime(h + " ساعة و " + m + " دقيقة");
            setNextPrayer("العشاء")
        }
        else { //Fajr
            // from  Isha to 11:59 PM
            var ishaTime = moment(timings["Isha"], 'HH:mm');
            var Mn = moment('23:59', 'HH:mm');
            let I2MN = moment.duration(Mn.diff(ishaTime));
            // from 11:59 PM to Fajr
            var Mn2 = moment("00:00", 'HH:mm');
            var fajrTime = moment(timings["Fajr"], 'HH:mm');
            let Mn2F = moment.duration(fajrTime.diff(Mn2));
            // Total Duration between Isha and Fajr
            const Isha2Fajr = I2MN.add(Mn2F);
            let Isha2FajrH = Isha2Fajr.hours()
            let Isha2FajrM = Isha2Fajr.minutes()
            setRemainTime(Isha2FajrH + " ساعة و " + Isha2FajrM + " دقيقة");
            setNextPrayer("الفجر")
        }
        }
    // Get Timimngs
    const getTimings = async () => {
        const res = await axios.get(
            `http://api.aladhan.com/v1/timingsByCity?city=${city.apiName}&country=egypt&method=5`
        )
        setTimings(res.data.data.timings)
        const hijriDate = res.data.data.date.hijri;
        setDate(hijriDate.day + " " + hijriDate.month.ar + " " + hijriDate.year);
        // const gregorianDate = res.data.data.date.gregorian.date;
        // setDateNow(gregorianDate);
        NextPrayer();
    }
    return (
        <>
            {/* Info */}
            <div className="grid grid-cols-2 gap-4 m-2">
                <div className=" text-center">
                    <p className='font-bold'>{city.name || "القاهرة"}</p>
                    <p>التاريخ الهجري: {JSON.stringify(date)} </p>
                    {/* <p>التاريخ الميلادي: {"\""+dateNow+"\""} </p> */}
                    {/* <span>الوقت : {timeNow}</span> */}
                </div>
                <div className="font-bold text-center">
                    <p>الصلاة القادمة :   <span className="text-blue-300"> {nextPrayer}</span></p>
                    <p>بعد :   <span className="text-blue-300"> {remainTime}</span></p>
                </div>
            </div>
            {/* City Select */}
            <div className="flex flex-col p-2">
                <label >اختر مدينة
                    <select className="m-2 w-6/12 p-2 bg-white text-gray-950 font-bold justify-center items-center"
                        onChange={(e) => {
                            const newCity = cities.find((city) => city.apiName === e.target.value)
                            setCity(newCity)
                        }}>
                        {cityList}
                    </select>
                </label>
            </div>
            <hr></hr>
            <p className="font-bold p-2 text-cyan-200">مواقيت الصلاة : </p>
            {/* Fajr */}
            <div className="flex flex-col justify-center items-center p-2">
                <div className="hover:bg-slate-500 w-5/6 justify-center">
                    <div className="grid grid-cols-3 gap-4 justify-center items-center">
                        <div>
                            <img src={mosque} alt="fajr"
                                style={{ width: "50px", height: "50px" }}
                            />
                        </div>
                        <div>
                            <p>الفجر</p>
                        </div>
                        <div>{timings.Fajr}</div>
                    </div>
                </div>

            </div>
            {/* Dhuhr */}
            <div className="flex flex-col justify-center items-center p-2">
                <div className="hover:bg-slate-500 w-5/6 justify-center">
                    <div className="grid grid-cols-3 gap-4 justify-center items-center">
                        <div>
                            <img src={morning} alt="fajr"
                                style={{ width: "50px", height: "50px" }}
                            />
                        </div>
                        <div>
                            <p>الظهر</p>
                        </div>
                        <div>{timings.Dhuhr}</div>
                    </div>
                </div>

            </div>
            {/* Asr */}
            <div className="flex flex-col justify-center items-center p-2">
                <div className="hover:bg-slate-500 w-5/6 justify-center">
                    <div className="grid grid-cols-3 gap-4 justify-center items-center">
                        <div>
                            <img src={kaaba} alt="fajr"
                                style={{ width: "50px", height: "50px" }}
                            />
                        </div>
                        <div>
                            <p>العصر</p>
                        </div>
                        <div>{timings.Asr}</div>
                    </div>
                </div>

            </div>
            {/* Maghrib */}
            <div className="flex flex-col justify-center items-center p-2">
                <div className="hover:bg-slate-500 w-5/6 justify-center">
                    <div className="grid grid-cols-3 gap-4 justify-center items-center">
                        <div>
                            <img src={evening} alt="fajr"
                                style={{ width: "50px", height: "50px" }}
                            />
                        </div>
                        <div>
                            <p>المغرب</p>
                        </div>
                        <div>{timings.Maghrib}
                        </div>
                    </div>
                </div>

            </div>
            {/* Isha */}
            <div className="flex flex-col justify-center items-center p-2">
                <div className="hover:bg-slate-500 w-5/6 justify-center">
                    <div className="grid grid-cols-3 gap-4 justify-center items-center">
                        <div>
                            <img src={hizb} alt="fajr"
                                style={{ width: "50px", height: "50px" }}
                            />
                        </div>
                        <div>
                            <p>العشاء</p>
                        </div>
                        <div>{timings.Isha}</div>
                    </div>
                </div>

            </div>
        </>
    )
}

