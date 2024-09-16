function createHealthCheckResultFlexMessage(healthCheckData) {
  let bmiColor = "#484848"; // Default color
  let temperatureColor = "#484848";
  let oxygenLevelColor = "#484848";
  let fastingBloodSugarColor = "#484848";


  const bmi = parseFloat(healthCheckData.bmi);
  if (bmi < 18.5 || bmi >= 25.0) {
    bmiColor = "#E4080A"; // Red for underweight and overweight
  }

  console.log('BMI Color:', bmiColor);  // Log สีที่ถูกเลือกตามค่า BMI


  // กำหนดสีของอุณหภูมิ (ตัวอย่างเกณฑ์: 36.1-37.2 องศาเซลเซียส)
  const temperature = parseFloat(healthCheckData.temperature);
  if (temperature > 39) {
    temperatureColor = "#E4080A"; // Red
  }

  // กำหนดสีของออกซิเจนในเลือด (ตัวอย่างเกณฑ์: 95-100%)
  const oxygenLevel = parseFloat(healthCheckData.oxygenLevel);
  if (oxygenLevel < 95) {
    oxygenLevelColor = "#E4080A"; // Red
  }

  // กำหนดสีของค่าน้ำตาลในเลือด (ตัวอย่างเกณฑ์: 70-99 mg/dL)
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
                text: `ชื่อ: ${healthCheckData.fullName}` + " " + `${healthCheckData.lastName}`,
                size: "sm",
                weight: "bold",
                color: "#484848",
                flex: 0
              }
            ]
          },
          // Add more contents here based on healthCheckData
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
                text: `อัตราการหายใจ: ${healthCheckData.respirationRate}`,
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
                text: `ช่วงเวลาที่เจาะ: ${healthCheckData.fastingTime}`,
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
                text: `รายละเอียดเพิ่มเติม: ${healthCheckData.moreDetails}`,
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
                text: `BMI: ${healthCheckData.bmi}`,
                size: "sm",
                weight: "bold",
                color: bmiColor,
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
                text: `ความดันโลหิต: ${healthCheckData.bloodPressure}`,
                size: "sm",
                weight: "bold",
                color: "#484848",
                flex: 0
              }
            ]
          },
        ]
      }
    }
  };
}

module.exports = {
  createHealthCheckResultFlexMessage
};
