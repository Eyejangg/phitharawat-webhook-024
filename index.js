const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient, Payload } = require("dialogflow-fulfillment"); // เรียกใช้ dialogflow เพราะเราจะเรียกใช้ webhookclient , payload
const port = 4000;

// create server
// import เซิฟเวอร์เข้ามาเรียกใช้ express ใช้ในการ create express appication
const app = express();

// middleware ตัวกลาง
app.use(bodyParser.json());

// แบบเดิม function (req, res) {}

// function แบบใหม่ - เรียก request , respone
// ถ้าเกิดมีคนพิมพ์ res เราจะส่ง / send ข้อความ บลาๆ
app.get("/", (req, res) => {
  res.send("<h1>Welcome, This is a webhook for Line chatbot </h1>");
}); // ขอบเขตของ function

app.post("/webhook", (req, res) => {
  //create webhook client
  // สร้าง agent req , res
  const agent = new WebhookClient({
    request: req,
    response: res,
  });

  //console.log("Dialogflow Request headers: " + JSON.stringify(req.headers)); //ตรวจสอบ
  //console.log("Dialogflow Request body: " + JSON.stringify(req.body)); // ตรวจสอบ
  // มี 3 ฝั่งชั่น
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function bodyMassIndex(agent) {
    let weight = agent.parameters.weight;
    let height = agent.parameters.height / 100;
    let bmi = (weight / (height * height)).toFixed(2);

    let result = "ขออภัย หนูไม่เข้าใจ";

    if (bmi < 18.5) {
      result = "คุณผอมไป กินข้าวบ้างนะ";
    } else if (bmi >= 18.5 && bmi <= 22.9) {
      result = "คุณหุ่นดีจุงเบย";
    } else if (bmi >= 23 && bmi <= 24.9) {
      result = "คุณเริ่มจะท้วมแล้วนะ";
    } else if ((bmi >= 25.8) & (bmi <= 29.9)) {
      result = "คุณอ้วนละ ออกกำลังกายหน่อยนะ";
    } else if (bmi > 30) {
      result = "คุณอ้วนเกินไปละ หาหมอเหอะ";
    }
    const flexMessage = {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "BMI Calculation Result",
              align: "center",
              weight: "bold",
              style: "normal",
            },
          ],
          backgroundColor: "#FFDEAD",
        },
        hero: {
          type: "image",
          url: "https://bucket.ex10.tech/images/8857e534-4422-11ef-891c-0242ac120003/originalContentUrl.jpg",
          size: "full",
          aspectRatio: "20:13",
          aspectMode: "cover",
          action: {
            type: "uri",
            uri: "https://line.me/",
          },
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "Your BMI Result",
              weight: "bold",
              size: "xl",
            },
            {
              type: "box",
              layout: "baseline",
              margin: "md",
              contents: [],
            },
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              spacing: "sm",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "ส่วนสูงของคุณครือ " + height * 100 + " เซนติเมตร",
                      color: "#aaaaaa",
                      size: "sm",
                      weight: "bold",
                      position: "relative",
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "น้ำหนักของคุณครือ " + weight + " กิโลกรัม",
                      color: "#aaaaaa",
                      size: "sm",
                      weight: "bold",
                    },
                  ],
                  offsetTop: "0px",
                },
              ],
              offsetTop: "0px",
            },
          ],
          backgroundColor: "#F0F8FF",
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "BMI: " + bmi,
              align: "center",
            },
            {
              type: "text",
              text: result,
              align: "center",
            },
            {
              type: "button",
              action: {
                type: "uri",
                label: "อ่านรายระเอียดเพิ่มเติม",
                uri: "https://www.lovefitt.com/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%AB%E0%B8%B2%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%94%E0%B8%B1%E0%B8%8A%E0%B8%99%E0%B8%B5%E0%B8%A1%E0%B8%A7%E0%B8%A5%E0%B8%81%E0%B8%B2%E0%B8%A2-bmi/",
              },
              style: "link",
            },
          ],
        },
        styles: {
          footer: {
            backgroundColor: "#F0FFF0",
          },
        },
      },
    };
    //   agent.add(result);

    let payload = new Payload("LINE", flexMessage, { sendAsMessage: true });
    agent.add(payload);
    // agent.add(result);
  }

  function calculateRectangleArea(agent) {
    let width = agent.parameters.width;
    let lenght = agent.parameters.lenght;
    let result = width * lenght;
    console.log(width);
    console.log(lenght);
    console.log(result);
    agent.add(
      "พื้นที่สี่เหลี่ยม กว้าง" +
        width +
        "ซม ความยาว" +
        lenght +
        "ซม result" +
        result
    );
  }

  function calculateTriangleArea(agent) {
    let base = agent.parameters.base;
    let height = agent.parameters.height;
    let result = 0.5 * (base * height);
    agent.add(
      `พื้นที่สามเหลี่ยม ฐาน ${base} ซม ความสูง ${height} ซม ผลของการคำนวณหาพื้นที่สามเหลี่ยมคือ: ${result}`
    );
  }

  function calculateCircleArea(agent) {
    let radius = agent.parameters.radius;
    let result = Math.PI * radius * radius;
    agent.add(
      `รัศมีของวงกลมคือ ${radius} พื้นที่ของวงกลมคือ ${result.toFixed(2)}`
    );
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("BMI - custom - yes", bodyMassIndex);
  intentMap.set("Area - rectangle - custom - yes", calculateRectangleArea);
  intentMap.set("Area - triangle - custom - yes", calculateTriangleArea);
  intentMap.set("Area - circle - custom - yes", calculateCircleArea);
  agent.handleRequest(intentMap);
});

// คอยตรวจสอบด้วยว่าจะมีคนฟังการทำงานเรา เคาะ port 4000 ให้โชว์การทำงาน port ออกมา
app.listen(port, () => {
  console.log("Server is running at http://localhost:" + port);
});
