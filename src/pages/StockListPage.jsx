import { Spin, Table, Tooltip } from "antd";
import Layout, { Content } from "antd/lib/layout/layout";
import { Link, useLocation, useParams } from "react-router-dom";
import NoData from "../components/NoData";
import NotFound from "../components/NotFound";
import SiteBreadcrumb from "../components/SiteBreadcrumb";
import SiteSider from "../components/SiteSider";
import { useStockListState } from "../hook/stockList";
const StockListPage = ({ module_type }) => {
  const location = useLocation();
  const pathList = location.pathname.split("/");
  const columns = [
    {
      title: "代號",
      dataIndex: "symbol",
      fixed: "left",
      width: 100,
      render: (symbol, row) => (
        <>
          <a href={row.url} target="_blank" rel="noopener noreferrer">
            <Tooltip title="前往 Webull 網站">
              <span>🌐 </span>
            </Tooltip>
          </a>
          {symbol}
        </>
      )
    },
    {
      title: "公司名稱",
      dataIndex: "companyName",
      fixed: "left",
      width: 150,
      render: (companyName, row) => (
        <Link
          to={`/${pathList[1]}/${pathList[2]}/${row.symbol.toLowerCase()}`}
          key={`${pathList[2]}/${row.symbol}`}
        >
          <Tooltip title="前往財務資料">{companyName}</Tooltip>
        </Link>
      )
    },
    {
      title: "股價",
      dataIndex: "price",
      width: 100,
      sorter: (a, b) => a.price - b.price
    },
    {
      title: "52週高點",
      dataIndex: "52weekHigh",
      width: 120,
      render: (number, row) =>
        number / row.price < 1.05 ? (
          <span style={{ backgroundColor: "green", color: "white" }}>
            <Tooltip title="位於近年內高點">{number}</Tooltip>
          </span>
        ) : (
          <span>{number}</span>
        )
    },
    {
      title: "52週低點",
      dataIndex: "52weekLow",
      width: 120,
      render: (number, row) =>
        row.price / number < 1.1 ? (
          <span style={{ backgroundColor: "red", color: "white" }}>
            <Tooltip title="位於近年內低點">{number}</Tooltip>
          </span>
        ) : (
          <span>{number}</span>
        )
    },
    {
      title: "漲跌",
      dataIndex: "delta",
      width: 80,
      sorter: (a, b) => a.delta - b.delta,
      render: (ratio) =>
        ratio > 0.05 ? (
          <span style={{ backgroundColor: "green", color: "white" }}>
            {Math.round(ratio * 1000) / 10}%
          </span>
        ) : ratio > 0 ? (
          <span style={{ color: "green" }}>
            {Math.round(ratio * 1000) / 10}%
          </span>
        ) : ratio < -0.05 ? (
          <span style={{ backgroundColor: "red", color: "white" }}>
            {Math.round(ratio * 1000) / 10}%
          </span>
        ) : ratio < 0 ? (
          <span style={{ color: "red" }}>{Math.round(ratio * 1000) / 10}%</span>
        ) : (
          <span>{Math.round(ratio * 1000) / 10}%</span>
        )
    },
    {
      title: "市值(億)",
      dataIndex: "value",
      width: 120,
      sorter: (a, b) => a.value - b.value,
      render: (value) =>
        value < 20 * Math.pow(10, 8) ? (
          <span style={{ color: "green" }}>
            <Tooltip title="小型股的表現，以及變動通常優於中、大型股">
              {Math.round(value / 10000000) / 10}
            </Tooltip>
          </span>
        ) : value > 100 * Math.pow(10, 8) ? (
          <span style={{ color: "red" }}>
            {Math.round(value / 10000000) / 10}
          </span>
        ) : (
          <span style={{ color: "orange" }}>
            <Tooltip title="中型股的表現，以及變動通常優於大型股">
              {Math.round(value / 10000000) / 10}
            </Tooltip>
          </span>
        )
    },
    {
      title: "PE",
      dataIndex: "TTM",
      width: 80,
      sorter: (a, b) => a["TTM"] - b["TTM"],
      render: (pe) => <span>{Math.round(pe * 10) / 10}</span>
    },
    {
      title: "預估PE",
      dataIndex: "forwardPe",
      width: 120,
      sorter: (a, b) => a.forwardPe - b.forwardPe,
      render: (forwardPe, row) =>
        row.TTM <= 0 && forwardPe > 0 ? (
          <span style={{ backgroundColor: "green", color: "white" }}>
            <Tooltip title="由虧轉盈">{forwardPe}</Tooltip>
          </span>
        ) : row.TTM >= 0 && forwardPe < 0 ? (
          <span style={{ backgroundColor: "red", color: "white" }}>
            <Tooltip title="由盈轉虧">{forwardPe}</Tooltip>
          </span>
        ) : forwardPe > 0 && forwardPe <= parseFloat(row.TTM) ? (
          <span style={{ color: "green" }}>
            <Tooltip title="因收益上升，推動估值下降">{forwardPe}</Tooltip>
          </span>
        ) : forwardPe > 0 && forwardPe > parseFloat(row.TTM) ? (
          <span style={{ color: "orange" }}>
            <Tooltip title="因收益下降，推動估值上升">{forwardPe}</Tooltip>
          </span>
        ) : forwardPe < 0 && parseFloat(forwardPe) < parseFloat(row.TTM) ? (
          <span style={{ color: "darkorange" }}>
            <Tooltip title="雖然虧損，但是收益上升，虧損減少">
              {forwardPe}
            </Tooltip>
          </span>
        ) : forwardPe < 0 && forwardPe < parseFloat(row.TTM) ? (
          <span style={{ color: "red" }}>
            <Tooltip title="越虧越多">{forwardPe}</Tooltip>
          </span>
        ) : (
          <span>{forwardPe}</span>
        )
    },
    {
      title: "PB",
      dataIndex: "pb",
      width: 80,
      sorter: (a, b) => a.pb - b.pb,
      render: (pb) => <span>{Math.round(pb * 10) / 10}</span>
    },
    {
      title: "PS",
      dataIndex: "ps",
      width: 80,
      sorter: (a, b) => a.ps - b.ps,
      render: (ps) => <span>{Math.round(ps * 10) / 10}</span>
    },
    {
      title: "回購率",
      dataIndex: "buyback_yield",
      width: 100,
      sorter: (a, b) => a.buyback_yield - b.buyback_yield,
      render: (value) =>
        value != 0 ? (
          <span style={{ color: "green" }}>{Math.round(value * 10) / 10}%</span>
        ) : (
          <span style={{ color: "lightgray" }}>{value}</span>
        )
    },
    {
      title: "殖利率",
      dataIndex: "yield",
      width: 100,
      sorter: (a, b) => a.yield - b.yield,
      render: (value) =>
        value != 0 ? (
          <span style={{ color: "green" }}>
            {Math.round(value * 1000) / 10}%
          </span>
        ) : (
          <span style={{ color: "lightgray" }}>
            {Math.round(value * 1000) / 10}
          </span>
        )
    },
    {
      title: "PEG(今/明)",
      dataIndex: "TTM",
      align: "center",
      width: 160,
      sorter: (a, b) => a.thisRevenue - b.thisRevenue,
      render: (pe, row) =>
        pe > 0 &&
        row.thisRevenue > 0 &&
        row.forwardPe > 0 &&
        row.nextRevenue > 0 &&
        pe / row.thisRevenue < 2 &&
        row.forwardPe / row.nextRevenue < 2 ? (
          <span style={{ backgroundColor: "green", color: "white" }}>
            <Tooltip title="可以用低價買到高成長股">
              <strong>
                {Math.round((pe / row.thisRevenue) * 10) / 10}倍 /{" "}
                {Math.round((row.forwardPe / row.nextRevenue) * 10) / 10} 倍
              </strong>
            </Tooltip>
          </span>
        ) : pe > 0 &&
          row.thisRevenue > 0 &&
          row.forwardPe > 0 &&
          row.nextRevenue > 0 ? (
          <span style={{ color: "green" }}>
            {Math.round((pe / row.thisRevenue) * 10) / 10}倍 /{" "}
            {Math.round((row.forwardPe / row.nextRevenue) * 10) / 10} 倍
          </span>
        ) : pe > 0 && row.thisRevenue > 0 ? (
          <span style={{ color: "green" }}>
            {Math.round((pe / row.thisRevenue) * 10) / 10}% /
          </span>
        ) : (
          <span></span>
        )
    },
    {
      title: "業績增長(今/明)",
      dataIndex: "thisRevenue",
      align: "center",
      width: 160,
      sorter: (a, b) => a.thisRevenue - b.thisRevenue,
      render: (ratio, row) =>
        ratio >= 30 && row.nextRevenue >= 30 ? (
          <span style={{ color: "green" }}>
            <strong>
              {ratio}/{row.nextRevenue}%
            </strong>
          </span>
        ) : ratio >= 30 && row.nextRevenue < 0 ? (
          <span>
            <span style={{ color: "green" }}>
              <strong>{ratio}/</strong>
            </span>
            <span style={{ color: "red" }}>{row.nextRevenue}%</span>
          </span>
        ) : ratio >= 30 ? (
          <span>
            <span style={{ color: "green" }}>
              <strong>{ratio}/</strong>
            </span>
            <span>{row.nextRevenue}%</span>
          </span>
        ) : ratio < -20 && row.nextRevenue < 0 ? (
          <span style={{ color: "red" }}>
            {ratio}/{row.nextRevenue}%
          </span>
        ) : ratio < -20 && row.nextRevenue > 30 ? (
          <span>
            <span style={{ color: "red" }}>{ratio}/</span>
            <span style={{ color: "green" }}>
              <strong>{row.nextRevenue}%</strong>
            </span>
          </span>
        ) : ratio < -20 ? (
          <span>
            <span style={{ color: "red" }}>{ratio}/</span>
            <span>{row.nextRevenue}%</span>
          </span>
        ) : (
          <span>
            {ratio}/{row.nextRevenue}%
          </span>
        )
    },
    {
      title: "利潤增長(今/明)",
      dataIndex: "thisEPS",
      width: 160,
      align: "center",
      sorter: (a, b) => a.thisEPS - b.thisEPS,
      render: (ratio, row) =>
        ratio >= 50 && row.nextEPS >= 50 ? (
          <span style={{ color: "green" }}>
            <strong>
              {ratio}/{row.nextEPS}%
            </strong>
          </span>
        ) : ratio >= 50 && row.nextEPS < 0 ? (
          <span>
            <span style={{ color: "green" }}>
              <strong>{ratio}/</strong>
            </span>
            <span style={{ color: "red" }}>{row.nextEPS}%</span>
          </span>
        ) : ratio >= 50 ? (
          <span>
            <span style={{ color: "green" }}>
              <strong>{ratio}/</strong>
            </span>
            <span>{row.nextEPS}%</span>
          </span>
        ) : ratio < -50 && row.nextEPS < 0 ? (
          <span style={{ color: "red" }}>
            {ratio}/{row.nextEPS}%
          </span>
        ) : ratio < -50 && row.nextEPS > 50 ? (
          <span>
            <span style={{ color: "red" }}>{ratio}/</span>
            <span style={{ color: "green" }}>
              <strong>{row.nextEPS}%</strong>
            </span>
          </span>
        ) : ratio < -50 ? (
          <span>
            <span style={{ color: "red" }}>{ratio}/</span>
            <span>{row.nextEPS}%</span>
          </span>
        ) : (
          <span>
            {ratio}/{row.nextEPS}%
          </span>
        )
    },
    {
      title: "未來業績",
      dataIndex: "next5Year",
      width: 80,
      sorter: (a, b) => a.next5Year - b.next5Year,
      render: (ratio) =>
        !ratio ? (
          <span></span>
        ) : ratio > 20 ? (
          <span style={{ color: "red" }}>
            <strong>{ratio}%</strong>
          </span>
        ) : ratio < -10 ? (
          <span style={{ color: "green" }}>
            <strong>{ratio}%</strong>
          </span>
        ) : (
          <span>{ratio}%</span>
        )
    },
    {
      title: "分析師評價",
      dataIndex: "analysis",
      width: 250,
      render: (str) =>
        str.match(/低於/) ? (
          <span style={{ color: "green" }}>{str}</span>
        ) : str.match(/高於/) ? (
          <span style={{ color: "red" }}>{str}</span>
        ) : (
          <span>{str}</span>
        )
    },
    {
      title: "關注度",
      dataIndex: "analystPopularity",
      width: 80,
      sorter: (a, b) => a.analystPopularity - b.analystPopularity
    },
    {
      title: (
        <Tooltip
          placement="bottomRight"
          title="財務指標為 F-Score 分數，是芝加哥大學的教授 Joseph Piotroski 在「從歷史財報中分辨出贏家及輸家」中，所提出的指標，分數 0~9 分，分數越高代表公司財務表現越好。"
        >
          財務指標
        </Tooltip>
      ),
      dataIndex: "fscore",
      width: 90,
      sorter: (a, b) => a.fscore - b.fscore,
      render: (fscore) =>
        fscore <= 3 ? (
          <span style={{ color: "red" }}>{fscore}</span>
        ) : fscore >= 7 ? (
          <span style={{ color: "green" }}>{fscore}</span>
        ) : (
          <span style={{ color: "orange" }}>{fscore}</span>
        )
    },
    {
      title: (
        <Tooltip
          placement="bottomRight"
          title="操縱分數是 M-Score，由Messod D. Beneish 在 1999 年提出，它通過財務比率，對財務的合理程度打分，主要用於判斷財務報表風險。
          M 值越高，則一家公司財務操縱的可能性越大，M ＜ -2.22時為安全，如果 -2.22 ≤ M ＜-1.78 之間，證明有一定風險，而如果 M ≥ -1.78，則公司造假風險高。"
        >
          操縱指標
        </Tooltip>
      ),
      dataIndex: "mscore",
      width: 90,
      sorter: (a, b) => a.mscore - b.mscore,
      render: (mscore) =>
        mscore === 0 ? (
          <span></span>
        ) : mscore <= -2.22 ? (
          <span style={{ color: "green" }}>{mscore}</span>
        ) : mscore >= -1.78 ? (
          <span style={{ color: "red" }}>{mscore}</span>
        ) : (
          <span style={{ color: "orange" }}>{mscore}</span>
        )
    },
    {
      title: (
        <Tooltip
          placement="bottomRight"
          title="破產指標為 Z-Score，由 Edward Altman 在 1968 年發表，通過對美國破產和非破產生產型企業進行觀察建立了 5 變量 Z-Score 模型。如果指標大於 2.99 則為安全，1.8 ≦ Z ＜ 2.99 有一定風險，Z ＜ 1.8 則有可能破產。"
        >
          破產指標
        </Tooltip>
      ),
      dataIndex: "zscore",
      width: 90,
      sorter: (a, b) => a.zscore - b.zscore,
      render: (zscore) =>
        zscore <= 1.81 ? (
          <span style={{ color: "red" }}>{zscore}</span>
        ) : zscore >= 2.99 ? (
          <span style={{ color: "green" }}>{zscore}</span>
        ) : (
          <span style={{ color: "orange" }}>{zscore}</span>
        )
    },
    {
      title: (
        <Tooltip
          placement="bottomRight"
          title="按照不同的估值方式所試算的企業合理股價"
        >
          林奇估值
        </Tooltip>
      ),
      dataIndex: "lynchvalue",
      width: 90,
      sorter: (a, b) => a.lynchvalue - b.lynchvalue,
      render: (value, row) =>
        !value ? (
          <span></span>
        ) : value >= row.price ? (
          <span style={{ color: "green" }}>
            <strong>{value}</strong>
          </span>
        ) : (
          <span>{value}</span>
        )
    },
    {
      title: (
        <Tooltip
          placement="bottomRight"
          title="按照不同的估值方式所試算的企業合理股價"
        >
          葛拉漢估值
        </Tooltip>
      ),
      dataIndex: "grahamnumber",
      width: 100,
      sorter: (a, b) => a.grahamnumber - b.grahamnumber,
      render: (value, row) =>
        !value ? (
          <span></span>
        ) : value >= row.price ? (
          <span style={{ color: "green" }}>
            <strong>{value}</strong>
          </span>
        ) : (
          <span>{value}</span>
        )
    },
    {
      title: (
        <Tooltip
          placement="bottomRight"
          title="按照不同的估值方式所試算的企業合理股價"
        >
          DCF估值
        </Tooltip>
      ),
      dataIndex: "iv_dcf",
      width: 90,
      sorter: (a, b) => a.iv_dcf - b.iv_dcf,
      render: (value, row) =>
        !value ? (
          <span></span>
        ) : value >= row.price ? (
          <span style={{ color: "green" }}>
            <strong>{value}</strong>
          </span>
        ) : (
          <span>{value}</span>
        )
    },
    {
      title: (
        <Tooltip
          placement="bottomRight"
          title="按照不同的估值方式所試算的企業合理股價"
        >
          FCF估值
        </Tooltip>
      ),
      dataIndex: "iv_dcf_share",
      width: 90,
      sorter: (a, b) => a.iv_dcf_share - b.iv_dcf_share,
      render: (value, row) =>
        !value ? (
          <span></span>
        ) : value >= row.price ? (
          <span style={{ color: "green" }}>
            <strong>{value}</strong>
          </span>
        ) : (
          <span>{value}</span>
        )
    },
    {
      title: (
        <Tooltip
          placement="bottomRight"
          title="按照不同的估值方式所試算的企業合理股價"
        >
          PS回歸估值
        </Tooltip>
      ),
      dataIndex: "medpsvalue",
      width: 100,
      sorter: (a, b) => a.medpsvalue - b.medpsvalue,
      render: (value, row) =>
        !value ? (
          <span></span>
        ) : value >= row.price ? (
          <span style={{ color: "green" }}>
            <strong>{value}</strong>
          </span>
        ) : (
          <span>{value}</span>
        )
    },
    {
      title: "參考資料",
      dataIndex: "symbol",
      width: 85,
      render: (symbol) => (
        <>
          <a
            href={
              "https://finance.yahoo.com/quote/" +
              symbol +
              "/analysis?p=" +
              symbol
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <Tooltip title="前往 Yahoo Finance 網站查閱預期成長資訊">
              Yahoo
            </Tooltip>
          </a>
          <br />
          <a
            href={
              "https://www.gurufocus.com/stock/" +
              symbol +
              "/summary?search=" +
              symbol
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <Tooltip title="前往 gurufocus 網站查閱財務分析數字">guru</Tooltip>
          </a>
        </>
      )
    }
  ];

  function onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
  }

  const { list_type } = useParams();
  const stockListState = useStockListState(module_type, list_type);
  const error =
    stockListState.error === null ? null : stockListState.error ===
      "No Data" ? (
      <NoData />
    ) : (
      <NotFound />
    );
  const loading =
    stockListState.loading || !stockListState.data ? <Spin /> : null;
  return (
    <>
      <SiteSider type={module_type} />
      <Layout style={{ padding: "0 24px 24px" }}>
        <SiteBreadcrumb />
        {error ? (
          error
        ) : loading ? (
          loading
        ) : (
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 900
            }}
          >
            <Table
              columns={columns}
              dataSource={stockListState.data}
              onChange={onChange}
              scroll={{ x: 1500 }}
              pagination={{ pageSize: 30 }}
            />
          </Content>
        )}
      </Layout>
    </>
  );
};

export default StockListPage;
