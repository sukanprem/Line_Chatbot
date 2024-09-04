function createHealthCheckResultFlexMessage(healthCheckData) {
  let bmiColor = "#000000"; // Default color

  const bmi = parseFloat(healthCheckData.bmi);

  if (bmi < 18.5) {
    bmiColor = "#0000FF"; // Blue
  } else if (bmi >= 18.5 && bmi <= 22.9) {
    bmiColor = "#00FF00"; // Green
  } else if (bmi >= 23.0 && bmi <= 24.9) {
    bmiColor = "#FFFF00"; // Yellow
  } else if (bmi >= 25.0 && bmi <= 29.9) {
    bmiColor = "#FFA500"; // Orange
  } else if (bmi >= 30.0) {
    bmiColor = "#FF0000"; // Red
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
                text: `ชื่อ: ${healthCheckData.fullName}` + `${healthCheckData.lastName}`,
                size: "sm",
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
                text: `ออกซิเจนในเลือด: ${healthCheckData.oxygenLevel}`,
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
                text: `อัตราการหายใจ: ${healthCheckData.respirationRate}`,
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
                text: `ค่าน้ำตาลในเลือด: ${healthCheckData.fastingBloodSugar}`,
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
