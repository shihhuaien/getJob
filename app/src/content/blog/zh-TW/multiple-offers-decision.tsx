import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "multiple-offers-decision",
  title: "拿到多個 Offer 怎麼選？三維度權重表幫你不憑感覺",
  description:
    "「給薪高的那個 vs 想去的那個」是錯誤的二分法。把 offer 拆成薪資、成長、文化三維度後，加權重決策才不會後悔。",
  category: "career",
  personaTags: ["evergreen"],
  publishedAt: "2026-04-14",
  updatedAt: "2026-04-14",
  readingMinutes: 5,
  author: "Offery 編輯團隊",
  ctaTool: "jobs",
  ctaText: "在追蹤板開一個 Offer 比較欄，並排對照",
  featured: true,
};

export default function Article() {
  return (
    <>
      <p>
        恭喜——你拿到不只一個 offer。但接下來這個禮拜可能比整個求職期還煎熬：「選 A 還是 B？」
      </p>
      <p>
        憑感覺選的人，三個月內常後悔。理性的方法是把 offer 拆成<strong>三個維度</strong>，每個維度再拆細項，最後乘上你個人的權重——這個過程本身會強迫你想清楚自己要什麼。
      </p>

      <h2>維度一：薪資（不只看月薪）</h2>
      <p>
        Total package 才是真實薪資，包含：
      </p>
      <ul>
        <li>
          <strong>月薪 × 14 個月</strong>（台灣常見：12 + 2 個月年終）
        </li>
        <li>
          <strong>績效獎金</strong>（問清楚發放歷史，不是「最高可達」）
        </li>
        <li>
          <strong>股票 / RSU</strong>（vesting 週期、現估值、流動性）
        </li>
        <li>
          <strong>其他福利</strong>：健身房、伙食、進修補助、彈性工時的金錢價值
        </li>
      </ul>
      <p>
        把兩個 offer 的 total package 算到 1 年期值，差距通常會跟你想像的不同。
      </p>

      <h2>維度二：成長（未來 2 年的你）</h2>
      <p>
        薪資是現在，成長是未來。三個指標：
      </p>

      <h3>1. 學習曲線</h3>
      <ul>
        <li>這份工作會讓你學到什麼新技能？</li>
        <li>你會跟什麼樣的人共事？（厲害的同事是最好的訓練）</li>
      </ul>

      <h3>2. 履歷加分</h3>
      <ul>
        <li>2 年後這份工作會讓你的下一份履歷更值錢嗎？</li>
        <li>公司在業界的品牌力如何？「曾在 X 公司」會打開哪些門？</li>
      </ul>

      <h3>3. 職涯路徑</h3>
      <ul>
        <li>1 至 2 年後可能升到什麼角色？</li>
        <li>內部轉組／轉地點的彈性如何？</li>
      </ul>

      <h2>維度三：文化（每天的體感）</h2>
      <p>
        最被低估、卻最影響日常幸福感的維度。判斷依據是<strong>面試過程中觀察到的細節</strong>，不是 HR 講的話。
      </p>
      <ul>
        <li>面試官回覆訊息的速度與態度（反映團隊節奏）</li>
        <li>面試裡有沒有問你「對團隊有什麼期待」（反映尊重個人）</li>
        <li>有沒有機會跟未來同事聊（願意開放 = 文化健康）</li>
        <li>主管在面試中怎麼描述「失敗」與「壓力」（避而不談 vs 坦率）</li>
      </ul>

      <h2>權重表：把感覺變成數字</h2>
      <p>
        現在用一張簡單的 Excel / Google Sheet：
      </p>
      <p>
        步驟一，給每個維度設定<strong>個人權重</strong>（總和 100）：
      </p>
      <ul>
        <li>新鮮人：薪資 30 / 成長 50 / 文化 20</li>
        <li>資深、要養家：薪資 50 / 成長 25 / 文化 25</li>
        <li>準備轉職、卡關中：薪資 25 / 成長 45 / 文化 30</li>
      </ul>
      <p>
        步驟二，每個 offer 在每個維度打 1 至 10 分：
      </p>
      <table>
        <thead>
          <tr>
            <th>維度</th>
            <th>權重</th>
            <th>Offer A</th>
            <th>Offer B</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>薪資</td>
            <td>30</td>
            <td>9</td>
            <td>7</td>
          </tr>
          <tr>
            <td>成長</td>
            <td>50</td>
            <td>6</td>
            <td>9</td>
          </tr>
          <tr>
            <td>文化</td>
            <td>20</td>
            <td>7</td>
            <td>8</td>
          </tr>
          <tr>
            <td>
              <strong>加權總分</strong>
            </td>
            <td>—</td>
            <td>
              <strong>71</strong>
            </td>
            <td>
              <strong>83</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        步驟三：分數出來後，<strong>問自己「這結果讓我開心嗎？」</strong>
      </p>
      <ul>
        <li>結果跟直覺一致 → 這就是答案</li>
        <li>結果跟直覺不同 → 思考為什麼。是某個維度被低估？還是直覺有偏見？</li>
      </ul>
      <p>
        這個方法的價值不在於「分數最高就選」，是<strong>強迫你把模糊的感覺講出來</strong>。
      </p>

      <h2>三個常見的決策陷阱</h2>
      <ol>
        <li>
          <strong>沉沒成本</strong>：「我面了 8 關才拿到 A，不選 A 浪費」——過去的時間成本不該影響未來決策。
        </li>
        <li>
          <strong>同儕壓力</strong>：「大家都覺得 B 公司比較好」——別人的權重不是你的。
        </li>
        <li>
          <strong>怕得罪人</strong>：「拒絕 A 會不會以後沒機會？」——專業地拒絕不會關門，反而留下好印象。
        </li>
      </ol>

      <h2>下一步</h2>
      <p>
        把所有 offer 詳細條件整理進 Offery 追蹤板的 offer 欄位，並開一個 Google Sheet 套上面的權重表。給自己 24 至 48 小時思考，但別超過——拖太久反而會讓焦慮主導決策。
      </p>
    </>
  );
}
