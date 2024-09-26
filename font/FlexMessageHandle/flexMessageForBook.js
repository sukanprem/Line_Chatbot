function createBookDoctorAppointmentOnlineFlexMessage(appointmentData) {
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
                text: `${appointmentData.firstName} ${appointmentData.lastName}`,
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
                text: `โรงพยาบาลที่นัด: ${appointmentData.hospital}`,
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
                text: `วันที่: ${appointmentData.date}`, // Use the actual date from appointmentData
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
                text: `เวลา: ${appointmentData.time}`, // Use the actual time from appointmentData
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

module.exports = {
  createBookDoctorAppointmentOnlineFlexMessage
};