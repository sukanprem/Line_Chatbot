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
          // {
          //   type: "box",
          //   layout: "baseline",
          //   contents: [
          //     {
          //       type: "text",
          //       text: `${appointmentData.healthPlan}`,
          //       size: "sm",
          //       color: "#484848",
          //       flex: 0
          //     }
          //   ]
          // },
          {
            type: "box",
            layout: "baseline",
            contents: [
              {
                type: "text",
                text: `${appointmentData.hospital}`,
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
                text: `วันที่: ${appointmentData.time_slot_id}`,
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
                text: `เวลา: ${appointmentData.time_slot_id}`,
                size: "sm",
                color: "#484848",
                flex: 0
              }
            ]
          },
        ]
      }
    }
  }

}

module.exports = {
  createBookDoctorAppointmentOnlineFlexMessage
};
