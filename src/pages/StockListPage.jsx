import { Skeleton, Table } from "antd";
import Layout, { Content } from "antd/lib/layout/layout";
import { useParams } from "react-router-dom";
import NoData from "../components/NoData";
import NotFound from "../components/NotFound";
import SiteBreadcrumb from "../components/SiteBreadcrumb";
import SiteSider from "../components/SiteSider";
import { useStockListState } from "../hook/stockList";

const columns = [
  {
    title: "代號",
    dataIndex: "symbol",
    fixed: "left",
    width: 80,
    render: (symbol, row) => <a href={row.url}>{symbol}</a>
  },
  {
    title: "公司名稱",
    dataIndex: "companyName",
    fixed: "left",
    width: 150
  },
  {
    title: "股價",
    dataIndex: "price",
    width: 80,
    sorter: (a, b) => a.price - b.price
  },
  {
    title: "52週高點",
    dataIndex: "52weekHigh",
    width: 120,
    sorter: (a, b) => a.price - b.price
  },
  {
    title: "52週低點",
    dataIndex: "52weekLow",
    width: 120,
    sorter: (a, b) => a.price - b.price
  },
  {
    title: "漲跌",
    dataIndex: "delta",
    width: 80,
    sorter: (a, b) => a.delta - b.delta,
    render: (ratio) => <span>{Math.round(ratio * 1000) / 10}%</span>
  },
  {
    title: "市值(億)",
    dataIndex: "value",
    width: 120,
    sorter: (a, b) => a.value - b.value,
    render: (value) => <span>{Math.round(value / 10000000) / 10}</span>
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
    render: (pe) => <span>{Math.round(pe * 10) / 10}</span>
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
    title: "分析師評價",
    dataIndex: "analysis",
    width: 250
  },
  {
    title: "關注度",
    dataIndex: "analystPopularity",
    width: 80
  },
  {
    title: "財務指標",
    dataIndex: "fscore",
    width: 90
  },
  {
    title: "操縱指標",
    dataIndex: "mscore",
    width: 90
  },
  {
    title: "破產指標",
    dataIndex: "zscore",
    width: 90
  },
  {
    title: "殖利率",
    dataIndex: "yield",
    width: 100,
    sorter: (a, b) => a.yield - b.yield,
    render: (ratio) => <span>{Math.round(ratio * 1000) / 10}%</span>
  },
  {
    title: "業績增長(今/明)",
    dataIndex: "thisRevenue",
    width: 160,
    sorter: (a, b) => a.thisRevenue - b.thisRevenue,
    render: (ratio, row) => (
      <span>
        {ratio}% / {row.nextRevenue}%
      </span>
    )
  },
  {
    title: "利潤增長(今/明)",
    dataIndex: "thisEPS",
    width: 160,
    sorter: (a, b) => a.thisEPS - b.thisEPS,
    render: (ratio, row) => (
      <span>
        {ratio}% / {row.nextEPS}%
      </span>
    )
  },
  {
    title: "未來業績",
    dataIndex: "next5Year",
    width: 80,
    sorter: (a, b) => a.next5Year - b.next5Year,
    render: (ratio) => <span>{ratio}%</span>
  },
  {
    title: "林奇估值",
    dataIndex: "lynchvalue",
    width: 90,
    sorter: (a, b) => a.lynchvalue - b.lynchvalue
  },
  {
    title: "葛拉漢估值",
    dataIndex: "grahamnumber",
    width: 100,
    sorter: (a, b) => a.grahamnumber - b.grahamnumber
  },
  {
    title: "DCF估值",
    dataIndex: "iv_dcf",
    width: 90,
    sorter: (a, b) => a.iv_dcf - b.iv_dcf
  },
  {
    title: "FCF估值",
    dataIndex: "iv_dcf_share",
    width: 90,
    sorter: (a, b) => a.iv_dcf_share - b.iv_dcf_share
  },
  {
    title: "PS回歸估值",
    dataIndex: "medpsvalue",
    width: 100,
    sorter: (a, b) => a.medpsvalue - b.medpsvalue
  }
];

function onChange(pagination, filters, sorter, extra) {
  console.log("params", pagination, filters, sorter, extra);
}

const StockListPage = ({ type }) => {
  const { list_type } = useParams();
  const stockListState = useStockListState(list_type);

  if (stockListState.error) {
    return stockListState.error === "No Data" ? <NoData /> : <NotFound />;
  }
  if (stockListState.loading || !stockListState.data) {
    return <Skeleton />;
  }
  return (
    <>
      <SiteSider type={type} />
      <Layout style={{ padding: "0 24px 24px" }}>
        <SiteBreadcrumb />
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
          />
        </Content>
      </Layout>
    </>
  );
};

export default StockListPage;