exports.handler = async (event) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const today = new Date().toLocaleDateString("ko-KR");

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `당신은 한국 주식 전문가입니다. 오늘 날짜: ${today}. 반드시 JSON만 반환하세요. 백틱 없이. 형식: {"kospi":"숫자","kospi_chg":"등락%","usd":"숫자","usd_chg":"등락원","oil":"숫자","oil_chg":"등락%","nasdaq":"숫자","nasdaq_chg":"등락%","sp500":"숫자","sp500_chg":"등락%","dow":"숫자","dow_chg":"등락%","stocks":[{"name":"종목명","price":"숫자","chg":"등락%","signal":"buy|sell|hold","news":"한줄뉴스"}],"ai_comment":"2-3문장브리핑","top_news":[{"tag":"종목명","text":"뉴스제목","time":"오늘"}]}`,
        messages: [{
          role: "user",
          content: `${today} 기준으로 알고있는 최신 데이터로 JSON 반환해줘: 1.코스피200선물,원달러환율,WTI유가 2.나스닥,S&P500,다우존스 3.다음 종목 최근 주가+뉴스+매수매도신호: 와이지원(122310),에코프로(086520),미래에셋증권(006800),한화시스템(272210),대덕전자(353200) 4.오늘 시장 브리핑 코멘트`
        }]
      })
    });

    const data = await res.json();
    const txt = data.content.map(c => c.type === "text" ? c.text : "").join("");
    const parsed = JSON.parse(txt.replace(/```json|```/g, "").trim());

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(parsed)
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: e.message })
    };
  }
};
