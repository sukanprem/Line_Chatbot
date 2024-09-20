// src/utils/createFlexMessages.js

export function createBookDoctorAppointmentOnlineFlexMessage(appointmentData) {
    return {
      type: "flex",
      altText: "ผลการจองพบแพทย์ออนไลน์",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "myHealthFirst",
              weight: "bold",
              size: "xl",
              color: "#64b3f0"
            },
            {
              type: "text",
              text: "จองพบแพทย์ออนไลน์ : ",
              weight: "bold",
              size: "sm",
              color: "#484848"
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "text",
                  text: `${appointmentData.firstName} ${appointmentData.lastName} จอง`,
                  size: "sm",
                  color: "#484848",
                  flex: 0
                }
              ]
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "text",
                  text: `${appointmentData.healthPlan}`,
                  size: "sm",
                  color: "#484848",
                  flex: 0
                }
              ]
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "text",
                  text: `${appointmentData.hospital} กับ ${appointmentData.doctor}`,
                  size: "sm",
                  color: "#484848",
                  flex: 0
                }
              ]
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "text",
                  text: `แผนก ${appointmentData.department} วันที่: ${appointmentData.date}`,
                  size: "sm",
                  color: "#484848",
                  flex: 0
                }
              ]
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "text",
                  text: `เวลา: ${appointmentData.time}`,
                  size: "sm",
                  color: "#484848",
                  flex: 0
                }
              ]
            }
          ]
        }
      }
    };
  }

  export function createHealthCheckResultFlexMessage(healthCheckData) {
    let bmiColor = "#484848"; // Default color
    let temperatureColor = "#484848";
    let oxygenLevelColor = "#484848";
    let fastingBloodSugarColor = "#484848";
  
    const bmi = parseFloat(healthCheckData.bmi);
    if (bmi < 18.5 || bmi >= 25.0) {
      bmiColor = "#E4080A"; // Red for underweight and overweight
    }
  
    const temperature = parseFloat(healthCheckData.temperature);
    if (temperature > 39) {
      temperatureColor = "#E4080A"; // Red
    }
  
    const oxygenLevel = parseFloat(healthCheckData.oxygenLevel);
    if (oxygenLevel < 95) {
      oxygenLevelColor = "#E4080A"; // Red
    }
  
    const fastingBloodSugar = parseFloat(healthCheckData.fastingBloodSugar);
    if (fastingBloodSugar < 70 || fastingBloodSugar > 99) {
      fastingBloodSugarColor = "#E4080A"; // Red
    }
  
    return {
      type: "flex",
      altText: "ผลการตรวจร่างกาย",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "myHealthFirst",
              weight: "bold",
              size: "xl",
              color: "#64b3f0"
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "text",
                  text: `ชื่อ: ${healthCheckData.firstName} ${healthCheckData.lastName}`,
                  size: "sm",
                  weight: "bold",
                  color: "#484848",
                  flex: 0
                }
              ]
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "text",
                  text: `น้ำหนัก: ${healthCheckData.weight}`,
                  size: "sm",
                  weight: "bold",
                  color: "#484848",
                  flex: 0
                }
              ]
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "text",
                  text: `ส่วนสูง: ${healthCheckData.height}`,
                  size: "sm",
                  weight: "bold",
                  color: "#484848",
                  flex: 0
                }
              ]
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "text",
                  text: `ชีพจร: ${healthCheckData.pulseRate}`,
                  size: "sm",
                  weight: "bold",
                  color: "#484848",
                  flex: 0
                }
              ]
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "text",
                  text: `อุณหภูมิ: ${healthCheckData.temperature}`,
                  size: "sm",
                  weight: "bold",
                  color: temperatureColor,
                  flex: 0
                }
              ]
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "text",
                  text: `ออกซิเจนในเลือด: ${healthCheckData.oxygenLevel}`,
                  size: "sm",
                  weight: "bold",
                  color: oxygenLevelColor,
                  flex: 0
                }
              ]
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "text",
                  text: `ค่าน้ำตาลในเลือด: ${healthCheckData.fastingBloodSugar}`,
                  size: "sm",
                  color: fastingBloodSugarColor,
                  flex: 0
                }
              ]
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "text",
                  text: `BMI: ${healthCheckData.bmi}`,
                  size: "sm",
                  weight: "bold",
                  color: bmiColor,
                  flex: 0
                }
              ]
            }
          ]
        }
      }
    };
  }
  export function createHospitalFlexMessage(healthCheckData) {
    return {
      type: "flex",
      altText: "ผลการตรวจร่างกาย",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "myHealthFirst",
              weight: "bold",
              size: "xl",
              color: "#64b3f0"
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "text",
                  text: `ผลการตรวจร่างกายของคุณ : `,
                  size: "sm",
                  weight: "bold",
                  color: "#484848",
                  flex: 0
                }
              ]
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "text",
                  text: `ชื่อ: ${healthCheckData.firstName} ${healthCheckData.lastName}`,
                  size: "sm",
                  weight: "bold",
                  color: "#484848",
                  flex: 0
                }
              ]
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "text",
                  text: `${healthCheckData.hospital}`,
                  size: "sm",
                  color: "#484848",
                  flex: 0
                }
              ]
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "text",
                  text: `ได้บันทึกผลตรวจสุขภาพของคุณ`,
                  size: "sm",
                  color: "#484848",
                  flex: 0
                }
              ]
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "text",
                  text: `เรียบร้อยแล้ว`,
                  size: "sm",
                  color: "#484848",
                  flex: 0
                }
              ]
            }
          ]
        }
      }
    };
  }
    