function createHospitalFlexMessage(healthCheckData) {
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
                            text: `ชื่อ: ${healthCheckData.firstName}` + " " + `${healthCheckData.lastName}`,
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
                            // weight: "bold",
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
                            // weight: "bold",
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
                            // weight: "bold",
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
    createHospitalFlexMessage
}