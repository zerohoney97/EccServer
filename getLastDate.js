const MongoClient=require('mongodb').MongoClient;
let connetToZeroHoneyMongoDb = 'mongodb+srv://zerohoney:e911291!e9@cluster0.wlnrf.mongodb.net/?retryWrites=true&w=majority';
module.exports={

    getLastDateInPreTest(req,res) {
        MongoClient.connect(connetToZeroHoneyMongoDb, function (err, client) {
            let dbEccEvaluationData = client.db('EccEvaluationData');


            let { id, category } = req.query;
            dbEccEvaluationData.collection('PreTest').find({ uid: id, smallCategory: category }, { projection: { date: 1 } }).toArray((err, result) => {
                let yearArray = new Array();
                let monthArray = new Array();
                let dayArray = new Array();
                let hourArray = new Array();
                let i;
                let split;
    
                let lastTime = {
                    year: '',
                    month: '',
                    day: '',
                    hour: ''
                }
    
                if (err) throw err;
    
    
                // 콜백 지옥 해결하자.... setTimeArray로 연도/월/날/시간 순으로 쪼개고lastTime object에 최근 날짜를 집어넣음
                const setLastTime = async () => {
                    setTimeArray(yearArray, monthArray, dayArray, hourArray, result, split).then(() => {
                        validateYear(yearArray).then((yearTempData) => {
                            lastTime.year = yearTempData;
                            validateMonth(monthArray).then((monthTempData) => {
                                lastTime.month = monthTempData;
                                validateDay(dayArray).then((dayTempData) => {
                                    lastTime.day = dayTempData;
                                    validateHour(hourArray).then((hourTempData) => {
                                        lastTime.hour = hourTempData;
                                        // object에 있는 각 날짜를 조합하여 찾음
                                        dbEccEvaluationData.collection('PreTest').find({ date: `${lastTime.year}/${lastTime.month}/${lastTime.day}/${lastTime.hour}` }).toArray((err, result) => {
                                            console.log(result);
                                            res.send(result);
    
                                        })
    
                                    })
                                })
    
                            });
                        })
                    })
                }
    
                setLastTime();
    
    
                //    불러온 날짜를 연도/월/일/시간 으로 쪼개서 각 배열에 push함
                async function setTimeArray() {
                    for (i = 0; i < result.length; i++) {
                        split = result[i].date.split('/');
                        yearArray.push(split[0]);
                        monthArray.push(split[1]);
                        dayArray.push(split[2]);
                        hourArray.push(split[3]);
                    }
    
    
                }
    
                async function validateYear(yearArray) {
    
                    // 가장 큰 값을 리턴하는 메소드 constructor로 개별 객체 사용=> tempData중복 활용 가능
                    for (i = 0; i < yearArray.length; i++) {
                        if (i == 0) {
                            this.tempData = yearArray[0];
    
                        } else if (tempData < yearArray[i]) {
                            this.tempData = yearArray[i];
    
                        }
    
                    }
    
                    return this.tempData;
    
                }
    
                async function validateMonth(monthArray) {
    
                    for (i = 0; i < monthArray.length; i++) {
                        if (i == 0) {
                            this.tempData = monthArray[0];
    
                        } else if (tempData < monthArray[i]) {
                            this.tempData = monthArray[i];
    
                        }
    
                    }
    
                    return this.tempData;
    
                }
    
                async function validateDay(dayArray) {
    
                    for (i = 0; i < dayArray.length; i++) {
                        if (i == 0) {
                            this.tempData = dayArray[0];
    
                        } else if (tempData < dayArray[i]) {
                            this.tempData = dayArray[i];
    
                        }
    
                    }
    
                    return this.tempData;
    
                }
                async function validateHour(hourArray) {
    
                    for (i = 0; i < hourArray.length; i++) {
                        if (i == 0) {
                            this.tempData = hourArray[0];
    
                        } else if (tempData < hourArray[i]) {
                            this.tempData = hourArray[i];
    
                        }
    
                    }
    
                    return this.tempData;
    
                }
    
    
            })
    


        })


    }


}